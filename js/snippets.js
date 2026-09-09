/**
 * Octen Search API Code Snippets & Response Data
 * Formatted and syntax-highlighted for the interactive console
 */

window.OCTEN_SNIPPETS = {
  // 1. Web Search (POST /search)
  web: {
    endpoint: "POST /search",
    requests: {
      highlights: `curl -X POST https://api.octen.ai/search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "query": "2026 Champions League final",
    "count": 5
  }'`,
      full_content: `curl -X POST https://api.octen.ai/search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "query": "standing desk ergonomics",
    "full_content": { "enable": true, "max_tokens": 4000 }
  }'`,
      page_images: `curl -X POST https://api.octen.ai/search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "query": "northern lights tonight",
    "topic": "news",
    "include_images": true
  }'`,
      source_filters: `curl -X POST https://api.octen.ai/search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "query": "central bank rate decision",
    "include_domains": ["reuters.com", "bloomberg.com"],
    "language": ["en"],
    "time_range": "week"
  }'`
    },
    response: `{
  "code": 0,
  "msg": "success",
  "request_id": "req_abc123def456",
  "data": {
    "results": [
      {
        "title": "Champions League final 2026 — result",
        "url": "https://www.uefa.com/uefachampionsleague/...",
        "highlight": "... won 2–1 after extra time, sealing a record-extending title ...",
        "authors": "UEFA",
        "time_published": "2026-05-30T21:48:00Z",
        "time_last_crawled": "2026-05-30T22:03:11Z"
      }
    ]
  },
  "meta": {
    "usage": { "num_search_queries": 1 },
    "latency": 64
  }
}`
  },

  // 2. Broad Search (POST /broad-search)
  broad: {
    endpoint: "POST /broad-search",
    requests: {
      grouped: `curl -X POST https://api.octen.ai/broad-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "query": "state of solid-state battery technology",
    "max_queries": 12
  }'`,
      shared_filters: `curl -X POST https://api.octen.ai/broad-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "query": "central bank decisions globally",
    "max_queries": 8,
    "search_options": {
      "topic": "news",
      "time_range": "week"
    }
  }'`,
      full_content: `curl -X POST https://api.octen.ai/broad-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "query": "compare cloud GPU pricing",
    "max_queries": 8,
    "search_options": {
      "full_content": { "enable": true }
    }
  }'`
    },
    response: `{
  "data": {
    "queries": [
      "solid-state battery pilot lines 2026",
      "sulfide vs oxide electrolyte progress"
    ],
    "search_results": [
      {
        "query": "solid-state battery pilot lines 2026",
        "results": [
          {
            "title": "Battery Breakthrough 2026 Report",
            "url": "https://example.com/energy/solid-state",
            "highlight": "Commercial pilot lines have reached 450 Wh/kg energy density..."
          }
        ],
        "latency": 69
      }
    ]
  },
  "meta": {
    "usage": { "num_search_queries": 12 }
  }
}`
  },

  // 3. Image Search (POST /image-search)
  image: {
    endpoint: "POST /image-search",
    requests: {
      text_query: `curl -X POST https://api.octen.ai/image-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "inputs": [{ "type": "text", "data": "red sports car" }],
    "count": 5
  }'`,
      reference_image: `curl -X POST https://api.octen.ai/image-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "inputs": [{ "type": "image", "url": "https://example.com/reference.jpg" }]
  }'`,
      design_mode: `curl -X POST https://api.octen.ai/image-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "inputs": [{ "type": "text", "data": "pricing table, dark theme, SaaS" }],
    "topic": "design",
    "html_snippet": { "enable": true }
  }'`,
      source_filters: `curl -X POST https://api.octen.ai/image-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "inputs": [{ "type": "text", "data": "Mars rover photos" }],
    "include_domains": ["nasa.gov"]
  }'`
    },
    response: `{
  "request_id": "req_9d1c4f7a2e6b0853",
  "data": {
    "results": [
      {
        "title": "Red sports car on coastal road",
        "url": "https://images.example.com/red-coupe.jpg",
        "source_page": "https://example.com/photos/red-coupe",
        "description": "A red sports car photographed in profile against a coastal backdrop.",
        "width": 1920,
        "height": 1280,
        "thumbnail": "https://images.example.com/red-coupe.jpg?w=200"
      }
    ]
  },
  "meta": {
    "latency": 642
  }
}`
  },

  // 4. Video Search (POST /video-search)
  video: {
    endpoint: "POST /video-search",
    requests: {
      text_query: `curl -X POST https://api.octen.ai/video-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "inputs": [{ "type": "text", "data": "how to tie a bowline knot" }],
    "count": 3
  }'`,
      recent_only: `curl -X POST https://api.octen.ai/video-search \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "inputs": [{ "type": "text", "data": "keynote highlights" }],
    "time_range": "week"
  }'`
    },
    response: `{
  "request_id": "20260627120000001ABCDE12345",
  "data": {
    "results": [
      {
        "title": "How to Tie a Bowline Knot",
        "url": "https://videos.example.com/watch/bowline.mp4",
        "source_page": "https://example.com/knots/bowline",
        "description": "A step-by-step demonstration of the bowline, tied slowly then at speed.",
        "cover_url": "https://cdn.example.com/thumbs/bowline.jpg",
        "duration_seconds": 184,
        "time_published": "2026-02-14T09:30:00Z"
      }
    ]
  },
  "meta": {
    "latency": 482
  }
}`
  }
};
