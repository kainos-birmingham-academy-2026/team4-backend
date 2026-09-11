-- Add terminal application statuses used by the recruitment assessment workflow.
INSERT INTO "Status" ("statusName")
VALUES ('Hired'), ('Rejected')
ON CONFLICT ("statusName") DO NOTHING;
