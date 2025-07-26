;; Certificate NFT Contract
;; This contract converts JSON certificate data into NFTs and stores them on-chain

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-not-found (err u102))
(define-constant err-metadata-frozen (err u103))
(define-constant err-already-exists (err u104))
(define-constant err-invalid-input (err u105))

;; Data Variables
(define-data-var last-token-id uint u0)
(define-data-var contract-uri (optional (string-utf8 256)) none)

;; Data Maps
;; Certificate metadata storage
(define-map certificates
    uint
    {
        name: (string-utf8 64),
        description: (string-utf8 256),
        image-uri: (string-utf8 256),
        issuer: (string-utf8 64),
        recipient: (string-utf8 64),
        issue-date: (string-utf8 32),
        expiry-date: (optional (string-utf8 32)),
        certificate-id: (string-utf8 64),
        course-name: (string-utf8 128),
        grade: (optional (string-utf8 16)),
        skills: (list 10 (string-utf8 32)),
        metadata-frozen: bool
    }
)

;; Token ownership
(define-map token-count principal uint)

;; Additional certificate data for complex JSON structures
(define-map certificate-extra-data
    uint
    {
        institution: (string-utf8 128),
        verification-url: (optional (string-utf8 256)),
        credentials: (string-utf8 512),
        achievements: (list 5 (string-utf8 64))
    }
)

;; Read-only functions

;; Get the last token ID
(define-read-only (get-last-token-id)
    (var-get last-token-id)
)

;; Get token URI (simplified to avoid string conversion complexity)
(define-read-only (get-token-uri (token-id uint))
    (ok (var-get contract-uri))
)

;; Get token owner
(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? certificate-nft token-id))
)

;; Get certificate details
(define-read-only (get-certificate (token-id uint))
    (map-get? certificates token-id)
)

;; Get certificate extra data
(define-read-only (get-certificate-extra-data (token-id uint))
    (map-get? certificate-extra-data token-id)
)

;; Get all certificates owned by a principal
(define-read-only (get-balance (account principal))
    (default-to u0 (map-get? token-count account))
)

;; Search certificates by issuer
(define-read-only (get-certificate-by-issuer (issuer (string-utf8 64)))
    ;; This would require iteration in a real implementation
    ;; For now, returns a placeholder
    none
)

;; Private functions

;; Mint new certificate NFT
(define-private (mint-certificate (recipient principal) (token-id uint))
    (begin
        (asserts! (is-none (nft-get-owner? certificate-nft token-id)) err-already-exists)
        (try! (nft-mint? certificate-nft token-id recipient))
        (map-set token-count recipient (+ (get-balance recipient) u1))
        (ok token-id)
    )
)

;; Public functions

;; Create a new certificate NFT from JSON data
(define-public (create-certificate 
    (recipient principal)
    (name (string-utf8 64))
    (description (string-utf8 256))
    (image-uri (string-utf8 256))
    (issuer (string-utf8 64))
    (recipient-name (string-utf8 64))
    (issue-date (string-utf8 32))
    (expiry-date (optional (string-utf8 32)))
    (certificate-id (string-utf8 64))
    (course-name (string-utf8 128))
    (grade (optional (string-utf8 16)))
    (skills (list 10 (string-utf8 32)))
)
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
        )
        (asserts! (> (len name) u0) err-invalid-input)
        (asserts! (> (len issuer) u0) err-invalid-input)
        (asserts! (> (len certificate-id) u0) err-invalid-input)
        
        ;; Mint the NFT
        (try! (mint-certificate recipient token-id))
        
        ;; Store certificate metadata
        (map-set certificates token-id {
            name: name,
            description: description,
            image-uri: image-uri,
            issuer: issuer,
            recipient: recipient-name,
            issue-date: issue-date,
            expiry-date: expiry-date,
            certificate-id: certificate-id,
            course-name: course-name,
            grade: grade,
            skills: skills,
            metadata-frozen: false
        })
        
        ;; Update last token ID
        (var-set last-token-id token-id)
        
        (ok token-id)
    )
)

;; Add extra certificate data (for complex JSON structures)
(define-public (add-certificate-extra-data
    (token-id uint)
    (institution (string-utf8 128))
    (verification-url (optional (string-utf8 256)))
    (credentials (string-utf8 512))
    (achievements (list 5 (string-utf8 64)))
)
    (let
        (
            (certificate (unwrap! (map-get? certificates token-id) err-not-found))
            (token-owner (unwrap! (nft-get-owner? certificate-nft token-id) err-not-found))
        )
        (asserts! (or (is-eq tx-sender token-owner) (is-eq tx-sender contract-owner)) err-not-token-owner)
        (asserts! (not (get metadata-frozen certificate)) err-metadata-frozen)
        
        (map-set certificate-extra-data token-id {
            institution: institution,
            verification-url: verification-url,
            credentials: credentials,
            achievements: achievements
        })
        
        (ok true)
    )
)

;; Transfer certificate NFT
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (asserts! (is-some (nft-get-owner? certificate-nft token-id)) err-not-found)
        (try! (nft-transfer? certificate-nft token-id sender recipient))
        (map-set token-count sender (- (get-balance sender) u1))
        (map-set token-count recipient (+ (get-balance recipient) u1))
        (ok true)
    )
)

;; Freeze certificate metadata (prevent further changes)
(define-public (freeze-certificate-metadata (token-id uint))
    (let
        (
            (certificate (unwrap! (map-get? certificates token-id) err-not-found))
            (token-owner (unwrap! (nft-get-owner? certificate-nft token-id) err-not-found))
        )
        (asserts! (or (is-eq tx-sender token-owner) (is-eq tx-sender contract-owner)) err-not-token-owner)
        
        (map-set certificates token-id (merge certificate { metadata-frozen: true }))
        (ok true)
    )
)

;; Update certificate metadata (only if not frozen)
(define-public (update-certificate-metadata
    (token-id uint)
    (name (string-utf8 64))
    (description (string-utf8 256))
    (image-uri (string-utf8 256))
)
    (let
        (
            (certificate (unwrap! (map-get? certificates token-id) err-not-found))
            (token-owner (unwrap! (nft-get-owner? certificate-nft token-id) err-not-found))
        )
        (asserts! (or (is-eq tx-sender token-owner) (is-eq tx-sender contract-owner)) err-not-token-owner)
        (asserts! (not (get metadata-frozen certificate)) err-metadata-frozen)
        
        (map-set certificates token-id (merge certificate {
            name: name,
            description: description,
            image-uri: image-uri
        }))
        (ok true)
    )
)

;; Set contract URI (owner only)
(define-public (set-contract-uri (uri (string-utf8 256)))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (var-set contract-uri (some uri))
        (ok true)
    )
)

;; Burn certificate (destroy NFT) - owner only
(define-public (burn (token-id uint))
    (let
        (
            (token-owner (unwrap! (nft-get-owner? certificate-nft token-id) err-not-found))
        )
        (asserts! (or (is-eq tx-sender token-owner) (is-eq tx-sender contract-owner)) err-not-token-owner)
        (try! (nft-burn? certificate-nft token-id token-owner))
        (map-delete certificates token-id)
        (map-delete certificate-extra-data token-id)
        (map-set token-count token-owner (- (get-balance token-owner) u1))
        (ok true)
    )
)

;; Define the NFT
(define-non-fungible-token certificate-nft uint)
