/**
 * Case study copy for each project landing page.
 * Structure is deliberately uniform: the problem, how it was approached,
 * the trade-offs that were actually made, and what would change next time.
 */

export const caseStudies = {
  'face-filter': {
    context:
      'Built as an in-store engagement screen: a camera pointed at shoppers, costumes and snow rendered over them live, and a gesture game that hands out a discount to a winner. It had to run unattended on modest hardware for hours at a time.',
    problem: [
      'Overlaying costumes on a live camera feed is easy to demo and hard to make watchable. Landmark detectors jitter frame to frame, so a hat pinned directly to raw coordinates vibrates on the head.',
      'It also had to handle several people in frame at once, keep running for hours without leaking memory, and be reconfigurable by a non-developer standing at the store — no rebuild, no code.',
    ],
    approach: [
      {
        title: 'Three MediaPipe models, one render loop',
        detail:
          'FaceLandmarker (478 landmarks), HandLandmarker, and PoseLandmarker run against the same video element inside a single requestAnimationFrame loop. Face drives costume placement, hands drive the game, pose drives the full-body tree outfit. One loop means one frame budget to reason about instead of three competing timers.',
      },
      {
        title: 'Positional smoothing instead of raw landmarks',
        detail:
          'Overlay transforms are averaged across a rolling window of recent frames rather than snapped to the newest detection. This trades a few frames of latency for overlays that sit still — the difference between a novelty and something people will stand in front of.',
      },
      {
        title: 'Refs for anything per-frame, state for anything rendered',
        detail:
          'Snowflake particles, face-tracking timestamps, loaded images, sledge position and game timers all live in useRef. Only values that actually change what React paints go through useState. Putting per-frame data in state would re-render the tree 60 times a second.',
      },
      {
        title: 'Operator console, not code changes',
        detail:
          'Snow speed and pile height, costume images, custom prop anchoring (face / nose / head / eyes / mouth), ad videos with duration-or-loop control, and game copy and timings are all configured from a settings screen. A drag-and-drop sequencer (dnd-kit) lets an operator order filters, ads, and the game into a playlist.',
      },
    ],
    tradeoffs: [
      {
        choice: 'Smoothing window over raw tracking',
        why: 'Overlays lag fast head turns by a few frames. Worth it — jitter is far more noticeable to a viewer than latency.',
      },
      {
        choice: 'Models loaded from a CDN at runtime',
        why: 'Keeps the bundle small and the models cacheable, but the app needs network on first load and cannot run fully offline.',
      },
      {
        choice: 'Client-side only, no backend',
        why: 'Camera frames never leave the browser, which sidesteps the entire privacy conversation. The cost is that settings do not persist across reloads.',
      },
      {
        choice: 'A single large VideoScreen component',
        why: 'The render loop, model lifecycles and draw calls are tightly coupled, and splitting them early would have meant threading a dozen refs through props. It grew past the point where that was the right call.',
      },
    ],
    learnings: [
      'Extract the render loop into a hook that owns the canvas and takes a list of draw functions. The component would shrink to layout, and each effect would become independently testable.',
      'Cache the model files in a service worker so a store kiosk survives a flaky connection.',
      'Persist settings to localStorage — losing an operator’s configuration on refresh is an obvious paper cut.',
      'Add an FPS and dropped-frame readout. Performance work without a number on screen is guesswork.',
    ],
  },

  'expense-splitter': {
    context:
      'A shared-expenses tracker for groups — trips, flatmates, recurring dinners. Someone pays, everyone else owes a slice, and the app keeps the running answer to "who owes whom".',
    problem: [
      'The hard part of splitting expenses is not arithmetic, it is agreement. Several people add entries from different devices at the same time, and everyone needs to see the same balances immediately or they stop trusting the number.',
      'It also has to be usable across currencies, and it has to answer the settle-up question directly rather than dumping a ledger and leaving people to do subtraction.',
    ],
    approach: [
      {
        title: 'Firestore listeners as the sync layer',
        detail:
          'Rather than fetch-on-mount plus manual refresh, the client subscribes to its groups and expenses. A write from one member propagates to every other open device without a refresh, which is what makes the shared balance believable.',
      },
      {
        title: 'Balances derived, never stored',
        detail:
          'Balances are computed from the expense list on read instead of being maintained as a counter. A stored total can drift out of sync with the entries that produced it; a derived one cannot.',
      },
      {
        title: 'Firebase Auth for identity',
        detail:
          'Group membership keys off Firebase Auth user IDs, so authorization rules live next to the data in Firestore rules rather than in client code that could be bypassed.',
      },
      {
        title: 'Groups as the unit of scope',
        detail:
          'Everything — expenses, members, balances — hangs off a group. That keeps queries narrow and makes the mental model match how people actually use it: one group per trip or household.',
      },
    ],
    tradeoffs: [
      {
        choice: 'Firebase instead of a custom backend',
        why: 'Real-time sync, auth, and hosting for nearly no backend code. The cost is vendor lock-in and business logic that has to live in security rules rather than a server layer.',
      },
      {
        choice: 'Computing balances client-side',
        why: 'Always consistent with the underlying data and trivial to reason about. It would need to move server-side or become an aggregate for a group with thousands of expenses.',
      },
      {
        choice: 'Multi-currency without live FX rates',
        why: 'Currency is recorded per expense but not converted, which keeps the app honest about what it knows instead of inventing an exchange rate.',
      },
    ],
    learnings: [
      'Add a settle-up suggestion that minimizes the number of transfers — the balance list answers "what do I owe", not "what is the fewest payments that clears this".',
      'Write the Firestore security rules test suite first. Rules are the actual authorization layer, so untested rules are untested auth.',
      'Support offline entry with optimistic writes. People add expenses in restaurants and taxis, which is exactly where connectivity fails.',
    ],
  },

  'ooo-generator': {
    context:
      'A small tool with a specific target: write a decent out-of-office auto-reply in under a minute, without an account, an API key, or anything being sent anywhere.',
    problem: [
      'Out-of-office messages are a tiny writing task everybody does badly under time pressure, usually right before leaving. Most generators either want a signup or hand the job to an LLM, which means latency, a key, and your dates leaving the browser.',
      'The interesting constraint was making the output feel written rather than filled in — a template with holes punched in it reads exactly like a template with holes punched in it.',
    ],
    approach: [
      {
        title: 'Tone as a real branch, not an adjective swap',
        detail:
          'Professional, Casual, Funny, and Minimal each produce a genuinely different message structure and phrasing rather than the same sentence with words substituted. Choosing a tone changes the shape of the output.',
      },
      {
        title: 'Deterministic generation, no model call',
        detail:
          'Everything is derived from the form inputs in the browser. Output is instant, works offline, costs nothing to run, and no dates or contact details leave the page. For a task this bounded, rules beat inference.',
      },
      {
        title: 'Graceful handling of partial input',
        detail:
          'Contact details adapt to what was actually provided — name only, email only, both, or neither — instead of emitting an empty label or a dangling comma. Most of the fiddly logic is here.',
      },
      {
        title: 'Chiptune audio synthesized at runtime',
        detail:
          'The 8-bit beach loop is generated with the Web Audio API — square-wave melody over triangle-wave bass at 112 BPM — rather than shipping an audio file. It fits the pixel-art theme and adds nothing to the bundle.',
      },
    ],
    tradeoffs: [
      {
        choice: 'Rule-based instead of LLM-generated',
        why: 'Instant, private, free, and offline-capable. The ceiling on how varied the output can get is lower — that is the right trade for a form with five fields.',
      },
      {
        choice: 'Pixel-art styling with Press Start 2P',
        why: 'Memorable and consistent, but a pixel font is harder to read at length, so it is kept to headings and controls rather than the generated message itself.',
      },
      {
        choice: 'Next.js for a fully static tool',
        why: 'More framework than a single page strictly needs. It buys routing, image handling, and a build pipeline that is ready if this grows past one page.',
      },
    ],
    learnings: [
      'Add message length variants — the same tone sometimes needs one line and sometimes needs a paragraph.',
      'Persist the last-used inputs. This is a tool people use twice a year and retype from scratch every time.',
      'Generate the .ics or direct calendar-status link alongside the text, since setting the auto-reply is only half of going away.',
    ],
    tested: {
      framework: 'Jest 30 + React Testing Library',
      detail:
        'The generation logic is the whole product, so it is the part under test — tone branching, partial-contact handling, and date formatting are covered by unit tests that run in CI.',
    },
  },

  'birthday-bot': {
    context:
      'A Discord bot for a friends server that kept forgetting birthdays. It takes reminders by chat command and announces them in the channel when they come due.',
    problem: [
      'Everyone on the server already had a calendar and nobody looked at it. The reminder had to arrive in the place the conversation was already happening, and adding one had to be a single message — anything requiring a web form would not get used.',
      'Two different needs sat behind one feature: "remind us in 20 minutes" and "remind us on this date at this time", and a date-based reminder means dealing with timezones honestly.',
    ],
    approach: [
      {
        title: 'Chat commands as the entire interface',
        detail:
          '!addreminder for a relative delay and !adddaterem for an absolute date and time. Prefix parsing over a slash-command registry kept the loop from idea to working command short, and the bot deletes the invoking message so the channel stays clean.',
      },
      {
        title: 'Timezone-aware date handling',
        detail:
          'date-fns-tz handles absolute reminders so a date entered by one member does not fire at the wrong hour for another. Relative reminders skip this entirely — a delay in minutes has no timezone.',
      },
      {
        title: 'Reminders tracked per user',
        detail:
          'Scheduled timers are held in a Map keyed by author ID, so a reminder can be listed and cancelled by the person who created it, and completed timers are cleaned out of the map rather than accumulating.',
      },
      {
        title: 'An Express endpoint to stay awake',
        detail:
          'A minimal HTTP server sits alongside the bot so a free-tier host has something to health-check, which is what keeps the process alive between events.',
      },
    ],
    tradeoffs: [
      {
        choice: 'In-memory Map instead of a database',
        why: 'Zero setup and fast, but every pending reminder is lost on restart. Acceptable for a friends server, disqualifying for anything real.',
      },
      {
        choice: 'setTimeout for scheduling',
        why: 'Simple and accurate for hours-away reminders. It does not survive a restart and is the wrong primitive for a birthday that recurs annually.',
      },
      {
        choice: 'Prefix commands over slash commands',
        why: 'Faster to build and works everywhere the bot can read messages. Slash commands would give autocomplete and argument validation for free — the README already flags this as in progress.',
      },
      {
        choice: '@everyone on announcements',
        why: 'Guarantees the reminder is seen. On a larger server this would be actively annoying and should be an opt-in role ping.',
      },
    ],
    learnings: [
      'Persist reminders — SQLite or a hosted Postgres — and rehydrate timers on boot. This is the one change that would make it trustworthy.',
      'Store birthdays as recurring annual events rather than one-off timestamps, which is what the bot is actually for.',
      'Finish the slash-command migration for validated arguments and discoverability.',
      'Replace long setTimeout calls with a periodic scan of due reminders, so accuracy no longer depends on uptime.',
    ],
    noDemo:
      'No hosted demo: a Discord bot runs against a specific server with its own token, so there is nothing to click from a web page. The README documents both commands and how to run your own instance.',
  },

  'hr-query-engine': {
    context:
      'An HR search tool that answers questions like "find backend engineers in engineering with strong design skills" over a company employee dataset. Two repos: a TypeScript/Express API doing the retrieval work, and a thin React client on top.',
    problem: [
      'Recruiters ask questions that are half semantic and half structural. "Strong system design skills" is a meaning question that keyword search cannot answer — the phrase may appear nowhere in the record. "In engineering with a performance score above 80" is a precise filter that a vector search will happily approximate and get wrong.',
      'Doing only one of the two fails in a specific way. Pure keyword search misses the candidate whose feedback says "excellent architectural instincts". Pure vector search returns someone with the right skills from the wrong department, because embeddings do not respect hard constraints.',
      'On top of that, embedding every query and every record through a paid API gets expensive quickly, and the same text gets embedded repeatedly during development and re-ingestion.',
    ],
    approach: [
      {
        title: 'Split the query into meaning and constraints',
        detail:
          'A GPT call interprets the natural-language query and extracts structured filters — department, minimum performance score — as data. What remains is treated as the semantic part. The two halves then travel down different paths instead of forcing one engine to do both jobs.',
      },
      {
        title: 'Weaviate for similarity, PostgreSQL for truth',
        detail:
          'Employee records live in PostgreSQL as the system of record. Embeddings of role, skills, and feedback live in Weaviate. Semantic search finds candidates by meaning; the structured filters are then applied against the relational data, so a hard constraint is never approximated.',
      },
      {
        title: 'Embedding cache to bound API cost',
        detail:
          'A dedicated cache layer (embeddingCache.ts, in-memory or Redis) sits in front of the OpenAI calls so identical text is embedded once. This matters most during re-ingestion and development, where the same dataset gets processed repeatedly.',
      },
      {
        title: 'Versioned, extensible filter schema',
        detail:
          'The query interpreter returns a versioned structured schema rather than ad-hoc fields, so a new filter type can be added without touching the core search path. The interpretation step is the thing most likely to change, so it is the thing kept most isolated.',
      },
      {
        title: 'CSV ingest as the loading path',
        detail:
          'Bulk upload through Multer and csv-parser, because HR data arrives as a spreadsheet export. The upload pipeline parses, writes to PostgreSQL, generates embeddings, and stores vectors in Weaviate in one pass.',
      },
      {
        title: 'Docker Compose for the stateful parts',
        detail:
          'Weaviate runs from Compose with a fixed schema initialised by a script, so the vector store is reproducible rather than a hand-configured local service.',
      },
    ],
    tradeoffs: [
      {
        choice: 'A GPT call in the query path',
        why: 'Handles phrasing a parser never would, at the cost of latency and per-query spend on every search. A rule-based parser would be free and instant but brittle; this is the right trade while the query surface is still being learned.',
      },
      {
        choice: 'Two datastores instead of pgvector',
        why: 'Weaviate is purpose-built and its filtering and schema tooling are strong. The cost is a second stateful service to run and keep in sync with Postgres — pgvector would have kept it to one database.',
      },
      {
        choice: 'Filtering after the vector search',
        why: 'Simple and correct, but the semantic search does not know about the constraints, so a narrow filter can thin out an already-limited result set. Pushing filters into the Weaviate query would fix this.',
      },
      {
        choice: 'Anonymous access on Weaviate',
        why: 'Fine for local development and exactly what makes Compose one command. It is not a production posture, and is called out as such.',
      },
      {
        choice: 'A deliberately thin frontend',
        why: 'The interesting problems here are retrieval and ranking, so the client is a small React app over axios. It demonstrates the API rather than competing with it for attention.',
      },
    ],
    learnings: [
      'Push the structured filters into the Weaviate query rather than filtering afterwards, so the top-k is drawn from the eligible set instead of being trimmed down to it.',
      'Add an evaluation set — a few dozen queries with expected results. Retrieval quality is currently judged by reading output, which does not scale and cannot catch a regression.',
      'Return a relevance score and show why a record matched. An HR tool that cannot explain its ranking will not be trusted with a hiring decision.',
      'Make the interpreter degrade gracefully: if the GPT call fails or times out, fall back to pure semantic search rather than failing the request.',
      'Batch the embedding calls during CSV ingest instead of per row — the single biggest win available on upload time and cost.',
    ],
    noDemo:
      'No hosted demo: this needs PostgreSQL, a Weaviate instance, and an OpenAI API key, and it operates on employee data. The README documents every endpoint with curl examples, and Docker Compose brings the stack up locally.',
  },

  wikitrail: {
    context:
      'A browser extension that records the Wikipedia rabbit holes you fall into and renders each one as an interactive force-directed graph — which articles you read, how long you spent, and the path you took to get there.',
    problem: [
      'Following Wikipedia links for an hour is a genuinely interesting intellectual path, and browser history destroys it. History is a flat, timestamped list: it keeps the articles and throws away the structure — what led to what, where you lingered, where you doubled back.',
      'The interesting artefact is the shape of the journey, not the set of pages. That needs the navigation graph, the dwell time per article, and a sensible notion of where one session ends and the next begins.',
      'It also has to be invisible while working. Anything requiring you to press record before going down a rabbit hole will never be running at the moment it matters.',
    ],
    approach: [
      {
        title: 'Passive capture via webNavigation',
        detail:
          'A background service worker listens to navigation events; a content script on Wikipedia reports the article title and how long the page was actually open. Nothing to start or stop — you browse normally and the graph builds itself.',
      },
      {
        title: 'Per-tab sessions with a 30-minute idle boundary',
        detail:
          'Session state is keyed by tab ID, so three Wikipedia tabs produce three independent trails instead of one tangled graph. A gap longer than 30 minutes starts a fresh session, which matches how rabbit holes actually end — you wander off, not click "done".',
      },
      {
        title: 'Time-on-page as node size, direction as edges',
        detail:
          'D3 v7 force layout where node radius encodes dwell time and arrows encode navigation direction. The article you were genuinely absorbed in is the biggest circle on screen, which is the entire insight the visualisation exists to deliver.',
      },
      {
        title: 'Annotations as first-class data',
        detail:
          'Any node takes a note, marked with a gold dot in the graph and in exports, and indexed by session search alongside titles. The thought you had while reading is often the thing worth keeping.',
      },
      {
        title: 'Three export formats for three purposes',
        detail:
          'A 2× PNG render for sharing an image, a self-contained interactive HTML page that keeps zoom, drag and hover for someone who does not have the extension, and Markdown with linked titles and dwell times for pasting into Obsidian or Notion.',
      },
      {
        title: 'One codebase across five browsers',
        detail:
          'Mozilla’s webextension-polyfill normalises the promise-based browser.* API, with a separate manifest for Firefox’s background-scripts model. D3 is vendored locally because extension CSP blocks CDN loads.',
      },
    ],
    tradeoffs: [
      {
        choice: 'Everything in browser.storage.local',
        why: 'No account, no server, and your reading history never leaves the machine — which for a record of what you read is the only defensible default. The cost is no sync across devices and a storage ceiling.',
      },
      {
        choice: 'A fixed 30-minute session boundary',
        why: 'Simple and predictable, and right most of the time. It cannot tell a genuine two-hour session with a lunch break from two separate sessions — an adaptive heuristic would be smarter and much harder to reason about.',
      },
      {
        choice: 'Time-on-page as a proxy for interest',
        why: 'Cheap to measure and usually meaningful, but it counts a tab you walked away from as deep engagement. Scroll depth would be a better signal.',
      },
      {
        choice: 'Wikipedia and Wiktionary only',
        why: 'Narrow host permissions are far easier to justify to a user than access to every page they visit, and Wikipedia’s stable article structure makes title extraction reliable.',
      },
      {
        choice: 'Vendored D3 in full',
        why: 'CSP leaves no real alternative, and it adds meaningful weight for a handful of force-layout functions. A custom layout would be smaller and much worse.',
      },
    ],
    learnings: [
      'Use scroll depth alongside dwell time, so an abandoned tab stops reading as an article you were engrossed in.',
      'Make the session boundary adaptive — infer it from the gap distribution rather than hardcoding thirty minutes.',
      'Add optional encrypted sync. The privacy default is right, but losing every trail when you change laptop is a real cost.',
      'Publish to the Chrome Web Store. "Load unpacked" limits this to people who already clone repositories.',
      'Enable GitHub Pages on the repo — sample-trail.html is a self-contained interactive demo that currently 404s from the README.',
    ],
    noDemo:
      'Browser extensions cannot be demoed on a web page. The repo ships sample-trail.html — a pre-baked interactive trail (Coffee → Battle of Waterloo) that opens in any browser with no install.',
  },

  inkmark: {
    context:
      'A browser extension that lets you highlight text on any page in four colours, attach notes, and have those highlights still be there the next time you visit. Vanilla JavaScript, zero dependencies, no build step.',
    problem: [
      'The hard problem in a web highlighter is not drawing the highlight — it is finding the same text again on the next visit. The page you highlighted is regenerated on every load, and the DOM you anchored to may not come back the same way.',
      'Naive approaches break immediately. A character offset into the page body shifts the moment a banner is injected. A positional XPath breaks when a sibling element appears above your target. Storing the highlighted string alone cannot distinguish between the fifth "the" and the ninth.',
      'And since it runs on every page a person visits, the privacy answer has to be unambiguous.',
    ],
    approach: [
      {
        title: 'XPath anchored to the nearest stable id',
        detail:
          'Rather than building a positional path all the way to the document root, getXPath walks up until it finds an element with a unique id and anchors there. A path rooted at //*[@id="mw-content-text"] survives banners and wrappers injected elsewhere in the page; a path from the root does not.',
      },
      {
        title: 'Per-page storage keyed by origin and path',
        detail:
          'Highlights are stored under inkmark:highlights:{origin}{pathname}, so a page load reads exactly the records it needs instead of scanning a global list. Query strings and fragments are deliberately excluded from the key so tracking parameters do not fragment the same article into several entries.',
      },
      {
        title: 'Anchoring that fails quietly',
        detail:
          'getElementByXPath returns null rather than throwing when a path no longer resolves. A page that has been restructured loses that highlight instead of breaking the extension on every subsequent load.',
      },
      {
        title: 'Zero dependencies, no build step',
        detail:
          'Ships as raw files — nothing to bundle, nothing to audit, nothing to keep up to date. For an extension with permission to read every page you visit, "you can read all of it in ten minutes" is a security property, not just a nicety.',
      },
      {
        title: 'Dashboard over the stored records',
        detail:
          'All highlights grouped by site, searchable across text, notes and site name, with JSON export. The store is simple enough that the dashboard is a straightforward read of it.',
      },
    ],
    tradeoffs: [
      {
        choice: 'XPath rather than text-quote anchoring',
        why: 'Simple, dependency-free, and good enough on stable content. A text-quote approach with prefix and suffix context (as used by Hypothesis) would survive restructuring far better, at real complexity cost.',
      },
      {
        choice: 'chrome.storage.local only',
        why: 'No account, no server, nothing leaves the browser. No sync across devices, and highlights are lost if the profile is cleared.',
      },
      {
        choice: '<all_urls> host permission',
        why: 'Unavoidable for a tool that highlights any page, and the broadest permission an extension can ask for. Zero dependencies and readable source are the mitigation.',
      },
      {
        choice: 'Four fixed colours',
        why: 'A closed set keeps the selection tooltip a single tap and the styling trivial. A colour picker would be more flexible and slower to use every single time.',
      },
      {
        choice: 'Vanilla JS with no bundler',
        why: 'Fast, tiny, and auditable. No module system or types, so the anchoring logic has to be kept small enough to hold in your head — which it is.',
      },
    ],
    learnings: [
      'Move to text-quote anchoring with surrounding context and keep XPath as a fast path. That is the single change that would most improve survival on real pages.',
      'Add a "highlights may have moved" state instead of silently dropping anchors that no longer resolve — the user should know something was lost.',
      'Write tests for getXPath against saved DOM fixtures. It is the load-bearing function and it currently has no coverage.',
      'Handle SPA navigation, where the URL changes without a page load and the content script never re-runs.',
      'Support export to Markdown as well as JSON, since highlights mostly want to end up in notes.',
    ],
    noDemo:
      'Browser extensions cannot run on a web page, so there is no hosted demo. Installation is Load Unpacked in Chrome, Edge or Brave, or a temporary add-on in Firefox — the README covers all four plus the Safari conversion path.',
  },

  'travis-filter': {
    context:
      'A desktop real-time video filter inspired by Travis Scott’s visual aesthetic: your silhouette cut out of the webcam feed and composited over animated psychedelic stripes. Python, OpenCV and MediaPipe, packaged as a standalone executable.',
    problem: [
      'The effect only works if the silhouette edge is clean and stable. MediaPipe’s selfie segmentation gives a per-pixel confidence mask, and thresholding it naively produces a jittering outline that flickers every frame — which reads as broken rather than stylised.',
      'It also has to hold a usable frame rate at 1280×720 while segmenting, generating an animated stripe field, and compositing, all in Python.',
      'And the audience is people who want to point a camera at themselves, not people who will install Python and pip a requirements file.',
    ],
    approach: [
      {
        title: 'Morphological refinement, then temporal smoothing',
        detail:
          'The raw confidence mask is blurred, dilated and eroded to close holes and clean the edge, then smoothed across frames so the outline stops vibrating. Per-mode segmentation config — threshold, blur, dilate, erode — because the two visual modes want genuinely different edge behaviour.',
      },
      {
        title: 'Per-mode tuning as data',
        detail:
          'SEG_CFG holds the segmentation parameters per mode, so switching modes swaps a config entry rather than branching through the pipeline. Tuning the look means editing numbers at the top of the file.',
      },
      {
        title: 'Procedural stripe field',
        detail:
          '120 animated stripe lines with random thickness pulses, cycling through a neon palette, alternating between horizontal and vertical phases every ten seconds. Generated rather than pre-rendered, so it never loops visibly.',
      },
      {
        title: 'Two modes from one pipeline',
        detail:
          'Mode 0 tints the silhouette over the stripe background; mode 1 is an infrared-style white silhouette on black. Both reuse the same segmentation and compositing path with different config and colour handling.',
      },
      {
        title: 'Shipped as an executable',
        detail:
          'PyInstaller spec files are committed for both variants, so it distributes as a binary rather than a Python environment someone else has to reproduce.',
      },
    ],
    tradeoffs: [
      {
        choice: 'Temporal smoothing on the mask',
        why: 'Removes the flicker that made the effect look broken, and the silhouette lags fast movement slightly. For a visual filter, stable beats instantaneous.',
      },
      {
        choice: 'Python and OpenCV rather than a shader',
        why: 'Fast to iterate on and MediaPipe’s Python bindings are excellent. A GPU shader pipeline would composite far faster but would have made the effect much slower to develop.',
      },
      {
        choice: 'Config constants rather than a UI',
        why: 'Every knob is tunable in a few lines at the top of the file, which is ideal while finding the look and useless to anyone who is not editing source. Keyboard controls cover the ones that matter live.',
      },
      {
        choice: 'Two near-duplicate scripts',
        why: 'travis_filter.py and travis_filter_rainbow.py diverge in palette handling. Copying was faster than parameterising, and it is duplication that will have to be paid down.',
      },
    ],
    learnings: [
      'Merge the two scripts behind a palette argument — the duplication is the clearest debt in the project.',
      'Move stripe generation and compositing to the GPU, which is where the remaining frame budget is.',
      'Expose the tuning constants as CLI flags or a small overlay, so the executable is adjustable without a Python install.',
      'Add a recording key. The output is inherently something people want to share, and right now there is no way to capture it.',
    ],
    noDemo:
      'A desktop OpenCV application needs a local webcam and a display window, so it cannot run in a browser. Install is pip install -r requirements.txt then python travis_filter.py, or build the PyInstaller binary from the committed spec.',
  },
};
