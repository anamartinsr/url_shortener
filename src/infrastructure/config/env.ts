import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT,
  redisUrl: process.env.REDIS_URL,
  cassandraContactPoints: process.env.CASSANDRA_CONTACT_POINTS,
  cassandraLocalDc: process.env.CASSANDRA_LOCAL_DATACENTER,
  cassandraKeyspace: process.env.CASSANDRA_KEYSPACE,
  hashidsSalt: process.env.HASHIDS_SALT,
  hashidsMinLength: Number(process.env.HASHIDS_MIN_LENGTH),
  counterKey: process.env.COUNTER_KEY,
  cacheTTL: Number(process.env.CACHE_TTL_SECONDS)
};
