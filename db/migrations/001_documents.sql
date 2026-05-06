-- Proplex documents table
-- Run if the table doesn't already exist with these columns.
-- Workspace isolation: every row carries workspace_id and every query filters on it.
-- For now workspace_id is the Clerk user_id (one workspace per user). When
-- multi-member workspaces land, swap the source via getWorkspaceId().

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS documents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    text NOT NULL,
  type            text NOT NULL,
  title           text NOT NULL,
  client_name     text,
  industry        text,
  template        text,
  client_tier     text,
  context         text,
  prepared_by     text,
  value           text,
  status          text NOT NULL DEFAULT 'Draft',
  generated_content jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_workspace_type_created_idx
  ON documents (workspace_id, type, created_at DESC);

-- Status values used by the app:
--   Draft | Consultant Review | Business Review | Management Review | Approved | Signed
