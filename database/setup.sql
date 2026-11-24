SELECT 'CREATE DATABASE gestor_tareas'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gestor_tareas')
\gexec

\connect gestor_tareas
\ir estructura.sql