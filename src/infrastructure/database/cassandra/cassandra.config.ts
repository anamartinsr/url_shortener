import cassandra from 'cassandra-driver';
import { env } from '../../config/env';

export const cassandraClient = new cassandra.Client({
  contactPoints: env.cassandraContactPoints,
  localDataCenter: env.cassandraLocalDc,
  keyspace: env.cassandraKeyspace,
  credentials: { username: env.cassandraUser, password: env.cassandraPassword }
});
