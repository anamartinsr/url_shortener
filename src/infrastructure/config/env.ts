import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  cassandraContactPoints: (process.env.CASSANDRA_CONTACT_POINTS || '127.0.0.1').split(','),
  cassandraLocalDc: process.env.CASSANDRA_LOCAL_DATACENTER,
  cassandraKeyspace: process.env.CASSANDRA_KEYSPACE,
  hashidsSalt: process.env.HASHIDS_SALT,
  hashidsMinLength: Number(process.env.HASHIDS_MIN_LENGTH),
  counterKey: process.env.COUNTER_KEY || 'global:url:id',
  cacheTTL: Number(process.env.CACHE_TTL_SECONDS),
  cassandraUser: (process.env.CASSANDRA_USER || 'cassandra'),
  cassandraPassword: (process.env.CASSANDRA_PASSWORD || '1234567')
};
