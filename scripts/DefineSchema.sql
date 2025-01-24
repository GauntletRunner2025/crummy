WITH schema_json AS (
  SELECT 
    json_build_object(
      'tables', (
        SELECT json_object_agg(table_name, (
          SELECT json_object_agg(column_name, udt_name)
          FROM information_schema.columns c
          WHERE c.table_schema = t.table_schema 
          AND c.table_name = t.table_name
        ))
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      )
    ) AS schema
)
SELECT schema::text FROM schema_json;