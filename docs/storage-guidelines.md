# Storage Guidelines

## Supabase Storage

Supabase Free includes Storage. We can use it safely if uploads are tightly limited.

Relevant free limits:

- 1 GB storage quota
- 50 MB max file size on Free projects
- 10 GB total bandwidth/egress

Our app should use stricter limits.

## Bucket

Use one private bucket:

```txt
resume_uploads
```

Path format:

```txt
{user_id}/{file_id}
```

## App-Level Upload Limits

Hosted free users:

- 3 uploaded files per user
- 2 MB max per file
- Allowed types: PDF, DOCX, TXT

We can raise this later, but the portfolio-hosted version should be conservative.

## What To Store

Allowed:

- Imported source resume PDF
- Imported source resume DOCX
- Plain text resume source

Avoid for MVP:

- Stored generated PDFs
- Profile photos
- Attachments
- Large template assets

## Generated PDFs

Generate PDFs on demand and let users download them.

Do not store generated PDFs permanently in Supabase Storage for the hosted free version.

## Cleanup

Later, add cleanup jobs:

- Delete orphaned uploads.
- Delete source uploads after successful import if the user chooses.
- Warn users before deleting files.
