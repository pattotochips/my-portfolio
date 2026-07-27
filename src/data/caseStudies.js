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
  },
};
