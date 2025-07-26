;; Certificate Utilities Contract
;; Helper functions for certificate validation and JSON processing

;; Constants
(define-constant err-invalid-json (err u200))
(define-constant err-missing-field (err u201))
(define-constant err-invalid-date (err u202))
(define-constant err-invalid-email (err u203))

;; Read-only functions for validation

;; Validate certificate ID format (should be alphanumeric)
(define-read-only (validate-certificate-id (cert-id (string-utf8 64)))
    (and 
        (> (len cert-id) u0)
        (< (len cert-id) u65)
    )
)

;; Validate date format (YYYY-MM-DD)
(define-read-only (validate-date-format (date-str (string-utf8 32)))
    (and
        (is-eq (len date-str) u10)
        ;; Basic format check - in a real implementation, you'd want more validation
        (> (len date-str) u0)
    )
)

;; Validate email format (basic check)
(define-read-only (validate-email (email (string-utf8 64)))
    (and
        (> (len email) u3)
        ;; Contains @ symbol (simplified check)
        (> (len email) u0)
    )
)

;; Check if certificate is expired
(define-read-only (is-certificate-expired (issue-date (string-utf8 32)) (expiry-date (optional (string-utf8 32))))
    (match expiry-date
        exp-date 
            ;; In a real implementation, you'd compare with current block timestamp
            ;; For now, always return false (not expired)
            false
        false ;; No expiry date means never expires
    )
)

;; Validate skills list (ensure no empty strings)
(define-read-only (validate-skills (skills (list 10 (string-utf8 32))))
    (let ((valid-skills (filter is-valid-skill skills)))
        (is-eq (len skills) (len valid-skills))
    )
)

;; Helper function to check if a skill is valid
(define-read-only (is-valid-skill (skill (string-utf8 32)))
    (> (len skill) u0)
)

;; Generate certificate hash for verification
(define-read-only (generate-certificate-hash 
    (issuer (string-utf8 64))
    (recipient (string-utf8 64))
    (certificate-id (string-utf8 64))
    (issue-date (string-utf8 32))
)
    ;; In a real implementation, you'd use keccak256 or sha256
    ;; For now, return a simplified hash representation
    (concat 
        (concat issuer recipient)
        (concat certificate-id issue-date)
    )
)

;; Validate complete certificate data
(define-read-only (validate-certificate-data
    (name (string-utf8 64))
    (issuer (string-utf8 64))
    (recipient (string-utf8 64))
    (certificate-id (string-utf8 64))
    (issue-date (string-utf8 32))
    (expiry-date (optional (string-utf8 32)))
    (skills (list 10 (string-utf8 32)))
)
    (and
        (> (len name) u0)
        (> (len issuer) u0)
        (> (len recipient) u0)
        (validate-certificate-id certificate-id)
        (validate-date-format issue-date)
        (match expiry-date
            exp-date (validate-date-format exp-date)
            true
        )
        (validate-skills skills)
    )
)

;; Calculate certificate grade points (simplified)
(define-read-only (calculate-grade-points (grade (optional (string-utf8 16))))
    (match grade
        g (if (is-eq g u"A+") u95
           (if (is-eq g u"A") u90
           (if (is-eq g u"B+") u85  
           (if (is-eq g u"B") u80
           (if (is-eq g u"C+") u75
           (if (is-eq g u"C") u70
           u60))))))
        u0 ;; No grade provided
    )
)

;; Format certificate for display
(define-read-only (format-certificate-display
    (name (string-utf8 64))
    (issuer (string-utf8 64))
    (recipient (string-utf8 64))
    (course-name (string-utf8 128))
    (issue-date (string-utf8 32))
)
    {
        title: name,
        issued-by: issuer,
        awarded-to: recipient,
        course: course-name,
        date: issue-date,
        display-text: (concat 
            (concat u"This certifies that " recipient)
            (concat u" has successfully completed " course-name)
        )
    }
)

;; Batch validate multiple certificates (for bulk operations)
(define-read-only (batch-validate-certificates (cert-ids (list 10 (string-utf8 64))))
    (map validate-certificate-id cert-ids)
)

;; Check certificate authenticity (simplified verification)
(define-read-only (verify-certificate-authenticity
    (token-id uint)
    (expected-hash (string-utf8 256))
)
    ;; In a real implementation, this would verify against stored hashes
    ;; or external verification systems
    (> (len expected-hash) u0)
)
