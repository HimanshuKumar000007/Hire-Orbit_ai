import { BlogPost } from "../types";

export const systemDesignInterviewCheatSheet: BlogPost = {
  slug: "system-design-interview-cheat-sheet",
  title: "System Design Interview Cheat Sheet: Scalability, Trade-Offs, and Architectures",
  excerpt: "Ace your senior engineering system design loop. Master database sharding, caching strategies, message queues, rate limiters, and the 4-step framework used by Staff Engineers.",
  metaDescription: "Comprehensive system design interview cheat sheet for software engineers. CAP theorem, caching strategies, horizontal scaling, database sharding, and interview frameworks.",
  publishedAt: "2026-09-28T00:00:00.000Z",
  readTime: "12 min read",
  category: "Interview Prep",
  author: {"name": "Himanshu Kumar", "role": "Founder & AI Systems Architect, HireOrbitAi"},
  tags: ["System Design", "Distributed Systems", "Software Architecture", "Senior Engineer", "Scalability"],
  seoKeywords: ["system design interview cheat sheet", "distributed systems architecture interview", "how to pass system design interview", "caching strategies database sharding", "scalability interview questions"],
  gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
  tableOfContents: [
  {
    "id": "the-4-step-framework",
    "title": "1. The 4-Step System Design Interview Framework"
  },
  {
    "id": "capacity-estimation",
    "title": "2. Essential Back-of-the-Envelope Mental Calculations"
  },
  {
    "id": "storage-tradeoffs",
    "title": "3. Storage Engine Trade-Offs: SQL vs. NoSQL vs. NewSQL"
  },
  {
    "id": "caching-patterns",
    "title": "4. Advanced Caching Patterns & Eviction Strategies"
  },
  {
    "id": "distributed-patterns",
    "title": "5. Distributed Coordination: Messaging & Rate Limiting"
  }
],
  faq: [
  {
    "question": "How much math is required in back-of-the-envelope calculations?",
    "answer": "Basic arithmetic using powers of ten and powers of two. Memorize numbers like seconds in a day (86,400 \u2248 100,000), bytes per character, and network latency thresholds."
  },
  {
    "question": "What is the single biggest mistake in system design interviews?",
    "answer": "Jumping directly to drawing boxes and databases before clarifying functional constraints, traffic scale, and latency requirements. Always spend the first 5 minutes defining requirements."
  }
],
  cta: {
  "headline": "Practice mock system design scenarios with AI",
  "subheadline": "HireOrbitAi's AI Coach challenges your architectural choices, asks edge-case questions, and grades your distributed systems trade-offs.",
  "buttonText": "Start System Design Prep",
  "buttonLink": "/interview"
},
  content: "\n## 1. The 4-Step System Design Interview Framework {#the-4-step-framework}\n\nA 45-minute senior engineering system design interview moves with extreme velocity. Candidate failure is almost never caused by a lack of knowledge regarding databases or caches; it is caused by chaotic time management and wandering without a structured framework.\n\nStaff and Principal Engineers navigate system design evaluations using a disciplined four-step cadence:\n\n### Step 1: Clarify Requirements & Scope (5-7 Minutes)\nNever start drawing boxes or selecting databases before establishing clear boundaries:\n* **Functional Requirements:** What 2-3 core features must the architecture support? (e.g., *User can post a 280-character message, follow other accounts, and view a real-time chronological timeline*).\n* **Non-Functional Requirements:** What are the latency constraints (e.g., read latency < 50ms, write latency < 200ms)? Is high availability prioritized over strict consistency (CAP Theorem)?\n* **Traffic & Scale Estimates:** Daily Active Users (DAU), read-to-write ratio, peak Queries Per Second (QPS), and 5-year storage projections.\n\n### Step 2: High-Level Architecture (10-12 Minutes)\nConstruct the end-to-end data flow from client devices to backend persistence:\n* Client $\\rightarrow$ DNS / CDN $\\rightarrow$ Load Balancer (Nginx / ALB) $\\rightarrow$ API Gateway $\\rightarrow$ Stateless Microservices $\\rightarrow$ Primary Database & Caching Layer.\n\n### Step 3: Deep Dive into Core Bottlenecks (15-20 Minutes)\nThe interviewer will probe your design with challenging failure scenarios:\n* *\"How does the system handle a viral celebrity posting a tweet to 80 million followers?\"*\n* *\"What happens when the primary database replica crashes during peak traffic?\"*\n* Detail your database sharding keys, indexing strategies, cache invalidation protocols, and fan-out mechanics.\n\n### Step 4: System Robustness & Failure Modes (5 Minutes)\nConclude by addressing single points of failure (SPOF), telemetry monitoring, circuit breakers, rate limiting, and graceful degradation strategies.\n\n---\n\n## 2. Essential Back-of-the-Envelope Mental Calculations {#capacity-estimation}\n\nMemorize these mathematical constants to execute capacity estimates effortlessly on the whiteboard:\n\n* $1 \\text{ day} = 86,400 \\text{ seconds} \\approx 10^5 \\text{ seconds}$\n* $100 \\text{ Million DAU} \\times 10 \\text{ requests/day} = 10^9 \\text{ requests/day} \\approx 10,000 \\text{ QPS}$\n* Peak QPS is typically estimated at $2\\times$ to $3\\times$ average QPS.\n* **Storage Units:** $1 \\text{ KB} = 10^3 \\text{ bytes} \\quad | \\quad 1 \\text{ MB} = 10^6 \\text{ bytes} \\quad | \\quad 1 \\text{ GB} = 10^9 \\text{ bytes} \\quad | \\quad 1 \\text{ TB} = 10^{12} \\text{ bytes}$\n* If each post consumes 500 bytes and users generate 100M posts daily: $10^8 \\times 500 = 50 \\text{ GB/day} \\approx 18.25 \\text{ TB/year}$.\n\n---\n\n## 3. Storage Engine Trade-Offs: SQL vs. NoSQL vs. NewSQL {#storage-tradeoffs}\n\n| Architectural Dimension | Relational (SQL) | Document (NoSQL) | Key-Value Store | Wide-Column |\n| :--- | :--- | :--- | :--- | :--- |\n| **Prominent Systems** | PostgreSQL, MySQL | MongoDB, Couchbase | Redis, Memcached | Apache Cassandra, ScyllaDB |\n| **Data Schema** | Rigid, normalized, ACID compliant | Flexible, hierarchical JSON | In-memory key-blob | Denormalized, tabular |\n| **Scaling Profile** | Vertical scaling, read replicas, complex sharding | Horizontal sharding out of the box | In-memory clustering | Massive horizontal write scaling |\n| **Best Utilization** | Financial ledgers, ACID order checkout | Catalogs, content management | Session caching, leaderboards | Time-series telemetry, chat history |\n\n---\n\n## 4. Advanced Caching Patterns & Eviction Strategies {#caching-patterns}\n\nCaching dramatically reduces database IOPS bottlenecks and slashes p99 latency:\n\n* **Cache-Aside (Lazy Loading):** The application queries the cache first. On a cache miss, it reads from the primary database, populates the cache, and returns the result. *Ideal for read-heavy workloads.*\n* **Write-Through:** The application writes simultaneously to the cache and the database. Ensures data consistency at the expense of slightly higher write latency.\n* **Write-Behind (Write-Back):** The application writes exclusively to the cache; the cache asynchronously flushes batches to the database. *Provides maximum write throughput, but risks data loss during server crashes.*\n* **Cache Invalidation Eviction Strategies:** LRU (Least Recently Used), LFU (Least Frequently Used), and strict TTL expiration to prevent stale data.\n\n---\n\n## 5. Distributed Coordination: Messaging & Rate Limiting {#distributed-patterns}\n\n* **Message Brokers (Apache Kafka vs. RabbitMQ vs. AWS SQS):** Decouple synchronous client HTTP requests from asynchronous heavy processing (email dispatch, video encoding, push notifications).\n* **Rate Limiting Algorithms:**\n  * **Token Bucket:** Allows bursts up to bucket capacity while refilling at a constant rate. Standard for modern API gateways.\n  * **Sliding Window Counter:** Blends low memory consumption with smooth traffic distribution, preventing burst exploits at window boundaries.\n\n---\n\n## 6. Real-World Case Study: Designing a Distributed URL Shortener {#tinyurl-case-study}\n\nTo demonstrate how the 4-step framework functions during a live interview, consider the classic TinyURL system:\n\n### 1. Requirements & Scale\n* **Write Volume:** 100M URLs generated monthly $\\approx 40$ writes/sec.\n* **Read Volume:** 10:1 read-to-write ratio $\\approx 400$ reads/sec.\n* **Short URL Length:** 7 Base62 characters ($62^7 \\approx 3.5$ trillion unique keys).\n\n### 2. Architectural Choices\n* **Database Selection:** A distributed Key-Value NoSQL store (DynamoDB or Cassandra) is selected because URL mappings are simple key-value pairs with zero relational joins.\n* **Hashing Strategy:** Generating Short URLs using a pre-allocated distributed sequence generator (Snowflake ID generator) encoded in Base62 to completely eliminate hash collision retries.\n* **Caching Layer:** Redis cluster caching the top 20% most active URLs (Pareto Principle), absorbing 80% of read queries and maintaining p99 read latency under 15ms.\n\n---\n\n## 7. Latency Numbers Every System Architect Must Know {#latency-numbers}\n\nWhen defending your architectural calculations in Staff-level interviews, anchor your reasoning in fundamental physical hardware constraints:\n\n| Operation | Approximate Physical Latency | Scaled Human Intuition |\n| :--- | :--- | :--- |\n| **L1 CPU Cache Reference** | $0.5 \\text{ ns}$ | 1 heartbeat |\n| **Branch Mispredict** | $5 \\text{ ns}$ | 10 heartbeats |\n| **L2 CPU Cache Reference** | $7 \\text{ ns}$ | 14 heartbeats |\n| **Main Memory (RAM) Access** | $100 \\text{ ns}$ | 3.3 minutes |\n| **SSD Random Read (NVMe)** | $150 \\ \\mu\\text{s}$ | 3.5 days |\n| **Datacenter Round-Trip (Same Rack)** | $500 \\ \\mu\\text{s}$ | 11 days |\n| **Standard HDD Seek** | $10 \\text{ ms}$ | 8 months |\n| **Internet Packet Transatlantic (NYC to London)** | $150 \\text{ ms}$ | 10 years |\n\nUnderstanding that memory access is nearly **a million times faster** than disk I/O and network requests is why intelligent caching layers and connection pooling represent the first line of defense in distributed scalability.\n"
};
