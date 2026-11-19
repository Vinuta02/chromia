window.ChromiaIndustries = (() => {
  'use strict';

  /* Simple 24x24 line icons */
  const ICON = {
    bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    cup: 'M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2',
    leaf: 'M5 19C5 10 11 5 20 5c0 9-5 14-13 14zM5 19l8-8',
    heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
    pin: 'M12 21s-6-5-6-11a6 6 0 0 1 12 0c0 6-6 11-6 11z',
    clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    star: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
  };

  /* Illustrations that use the palette through CSS variables */
  const ART = {
    cup: `<svg viewBox="0 0 320 260" aria-hidden="true"><circle cx="160" cy="130" r="108" fill="var(--c-primary)" opacity=".14"/>
      <ellipse cx="160" cy="222" rx="100" ry="14" fill="var(--c-secondary)"/>
      <path d="M242 126h0a22 22 0 0 1 0 44h-14" fill="none" stroke="var(--c-primary)" stroke-width="10" stroke-linecap="round"/>
      <path d="M92 110H228V160A58 58 0 0 1 170 218H150A58 58 0 0 1 92 160Z" fill="var(--c-primary)"/>
      <ellipse cx="160" cy="110" rx="68" ry="9" fill="var(--c-accent)"/>
      <path d="M130 88c-10-12 10-18 0-32M160 88c-10-12 10-18 0-32M190 88c-10-12 10-18 0-32" fill="none" stroke="var(--c-text-muted)" stroke-width="5" stroke-linecap="round" opacity=".55"/></svg>`,
    rings: `<svg viewBox="0 0 320 240" aria-hidden="true"><circle cx="132" cy="140" r="52" fill="none" stroke="var(--c-primary)" stroke-width="12"/>
      <circle cx="188" cy="140" r="52" fill="none" stroke="var(--c-secondary)" stroke-width="12"/>
      <path d="M160 58l16 18-16 18-16-18z" fill="var(--c-accent)"/>
      <circle cx="60" cy="60" r="6" fill="var(--c-accent)" opacity=".7"/><circle cx="268" cy="86" r="8" fill="var(--c-primary)" opacity=".5"/><circle cx="250" cy="200" r="5" fill="var(--c-secondary)" opacity=".7"/></svg>`,
    peaks: `<svg viewBox="0 0 320 260" aria-hidden="true"><circle cx="250" cy="62" r="28" fill="var(--c-accent)"/>
      <path d="M0 230L90 100l50 70 60-100 120 160z" fill="var(--c-primary)"/>
      <path d="M150 230l80-96 90 96z" fill="var(--c-secondary)"/>
      <path d="M0 230h320v20H0z" fill="var(--c-surface)"/></svg>`,
    leaf: `<svg viewBox="0 0 320 260" aria-hidden="true"><circle cx="248" cy="196" r="30" fill="var(--c-accent)" opacity=".85"/>
      <path d="M60 220C60 120 140 50 260 50c0 110-70 180-170 180z" fill="var(--c-primary)"/>
      <path d="M72 212C120 150 170 110 232 70" fill="none" stroke="var(--c-surface)" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      <circle cx="70" cy="60" r="16" fill="var(--c-secondary)" opacity=".8"/></svg>`,
  };

  const IND = {
    generic: { label: 'Generic app' },
    coffee: {
      label: 'Coffee shop', brand: 'Ember & Oak', nav: ['Menu', 'Story', 'Visit'], btn: 'Order online', pill: 'Freshly roasted daily',
      h: 'Small-batch coffee, brewed with care', p: 'Single-origin beans, warm pastries, and a corner table that feels like yours.',
      meta: 'Open 7am to 6pm &middot; 12 Elm Street', b1: 'Order pickup', b2: 'See the menu', proof: '4.9 from 2,300 regulars', art: 'cup',
      feats: [['cup', 'Single origin', 'Beans from three family farms.'], ['clock', 'Ready in minutes', 'Order ahead and skip the line.'], ['heart', 'Made with love', 'Baked fresh every morning.']],
      ban: ['Join the Ember Club', 'A free drink after every ninth visit.', 'Join free'],
      dash: { nav: ['Overview', 'Orders', 'Menu', 'Staff', 'Settings'], title: 'Today at the shop', sub: 'Sales and orders so far',
        stats: [['Sales', '$1,842', '&#9650; 9.2%', 'ok'], ['Orders', '126', '&#9650; 14', 'ok'], ['Out of stock', '3', '! Restock', 'wr']], chart: 'Sales by hour', list: 'Live orders',
        rows: [['Oat latte', '2 min', '&#10003; Ready', 'ok'], ['Cold brew', '5 min', '! Brewing', 'wr'], ['Croissant', 'Sold out', '&#10005; Empty', 'er'], ['Mocha', '1 min', '&#10003; Ready', 'ok']] },
      app: { hi: 'Hi, Alex', sub: 'Ember Club', card: ['Loyalty card', '7 of 9 stamps', 'Two more for a free drink', 78], chips: ['Favorites', 'Hot', 'Iced', 'Food'],
        items: [['Oat latte', '$4.80', 'p', 1], ['Cold brew', '$4.20', 's', 1], ['Almond croissant', '$3.50', 'a', 0], ['Flat white', '$4.50', 'p', 0]] },
    },
    wedding: {
      label: 'Wedding invite', brand: 'Maya & Leo', nav: ['Story', 'Details', 'RSVP'], btn: 'RSVP', pill: 'Save the date', center: true,
      h: 'Maya and Leo are getting married', p: 'Join us for a day of love, music, and dancing under the stars.',
      meta: 'June 14, 2027 &middot; Lakeside Garden', b1: 'RSVP now', b2: 'View details', proof: '86 guests confirmed', art: 'rings',
      feats: [['heart', 'The ceremony', '4:00 PM at the garden.'], ['star', 'The party', 'Dinner and dancing from 6:30 PM.'], ['pin', 'Getting there', 'Shuttles leave from the hotel.']],
      ban: ['Will you join us?', 'Please reply by April 30.', 'RSVP'],
      dash: { nav: ['Overview', 'Guests', 'Seating', 'Gifts', 'Settings'], title: 'Guest list', sub: 'RSVP tracker',
        stats: [['Invited', '124', '&#9650; 12 new', 'ok'], ['Attending', '86', '&#10003; 69%', 'ok'], ['Awaiting reply', '31', '! Send reminder', 'wr']], chart: 'Replies per week', list: 'Latest replies',
        rows: [['Priya Nair', 'Plus one', '&#10003; Attending', 'ok'], ['Tom Hale', 'Table 4', '! Pending', 'wr'], ['Jess Wu', 'Regrets', '&#10005; Declined', 'er'], ['Omar Ali', 'Table 2', '&#10003; Attending', 'ok']] },
      app: { hi: '86 days to go', sub: 'Maya and Leo', card: ['Wedding checklist', '18 of 25 done', 'Next: finalize seating', 72], chips: ['All', 'Venue', 'Guests', 'Food'],
        items: [['Book photographer', 'Done', 'p', 1], ['Send invitations', 'Done', 's', 1], ['Choose cake', 'Done', 'a', 1], ['Seating chart', 'Due May 2', 'p', 0]] },
    },
    fitness: {
      label: 'Fitness brand', brand: 'Pulse', nav: ['Classes', 'Trainers', 'Pricing'], btn: 'Join now', pill: 'First week free',
      h: 'Train harder. Recover smarter.', p: 'Strength, cardio, and recovery classes led by coaches who push you to your best.',
      meta: 'Open 5am to 11pm &middot; 3 locations', b1: 'Start free week', b2: 'View classes', proof: '9,800 active members',
      feats: [['bolt', 'Expert coaches', 'Personal plans for every level.'], ['clock', 'Flexible hours', 'Open early, open late.'], ['chart', 'Track progress', 'See your gains week by week.']],
      ban: ['Your first week is on us', 'No contract. Cancel anytime.', 'Claim offer'],
      dash: { nav: ['Overview', 'Members', 'Classes', 'Trainers', 'Settings'], title: 'Gym overview', sub: 'Today across all locations',
        stats: [['Check-ins', '842', '&#9650; 6.1%', 'ok'], ['Active members', '3,420', '&#9650; 2.4%', 'ok'], ['Expiring soon', '58', '! Follow up', 'wr']], chart: 'Check-ins by hour', list: 'Class bookings',
        rows: [['HIIT 6:00 AM', '18 of 20', '&#10003; Open', 'ok'], ['Yoga flow', '20 of 20', '! Full', 'wr'], ['Spin 7:30 PM', 'Coach away', '&#10005; Cancelled', 'er'], ['Strength', '12 of 16', '&#10003; Open', 'ok']] },
      app: { hi: 'Hi, Alex', sub: '5-day streak', card: ['Calories burned', '540 kcal', 'Goal: 750 kcal today', 72], chips: ['All', 'Strength', 'Cardio', 'Yoga'],
        items: [['Upper body', '45 min', 'p', 1], ['Morning run', '5 km', 's', 1], ['Mobility', '15 min', 'a', 1], ['Evening yoga', '30 min', 'p', 0]] },
    },
    fintech: {
      label: 'Fintech', view: 'dashboard', brand: 'Finch', nav: ['Cards', 'Savings', 'Business'], btn: 'Open account', pill: 'No monthly fees',
      h: 'Money that works as hard as you do', p: 'Save, spend, and invest from one simple account with instant insights.',
      b1: 'Open account', b2: 'See how it works', proof: 'Trusted by 400,000 customers',
      feats: [['shield', 'Bank-grade security', 'Protected with biometric login.'], ['chart', 'Smart insights', 'See where every dollar goes.'], ['bolt', 'Instant transfers', 'Send money in seconds.']],
      ban: ['Start saving today', 'Open an account in under 3 minutes.', 'Get started'],
      dash: { nav: ['Overview', 'Cards', 'Savings', 'Invest', 'Settings'], title: 'Your money', sub: 'Updated just now',
        stats: [['Balance', '$24,860', '&#9650; 3.2%', 'ok'], ['Spending', '$3,420', '! 82% of budget', 'wr'], ['Savings rate', '18%', '&#9650; 2 pts', 'ok']], chart: 'Spending by month', list: 'Transactions',
        rows: [['Spotify', '$9.99', '&#10003; Cleared', 'ok'], ['Rent', '$1,450.00', '! Pending', 'wr'], ['Card refund', '$42.00', '&#10003; Cleared', 'ok'], ['Unknown vendor', '$310.00', '&#10005; Blocked', 'er']] },
      app: { hi: '$24,860', sub: 'Total balance', card: ['Monthly budget', '$3,420 spent', '$740 left this month', 82], chips: ['All', 'Bills', 'Food', 'Travel'],
        items: [['Groceries', '$86.40', 'p', 1], ['Metro pass', '$30.00', 's', 1], ['Dinner out', '$54.20', 'a', 1], ['Gym', '$29.00', 'p', 0]] },
    },
    travel: {
      label: 'Travel blog', brand: 'Wander', nav: ['Trips', 'Stories', 'Guides'], btn: 'Plan a trip', pill: 'Summer deals are live',
      h: 'Find your next favorite place', p: 'Hand-picked trips, honest guides, and local tips from people who have been there.',
      meta: 'Over 120 destinations', b1: 'Explore trips', b2: 'Read stories', proof: 'Rated 4.8 by 20,000 travelers', art: 'peaks',
      feats: [['pin', 'Local picks', 'Hidden spots, not tourist traps.'], ['star', 'Trusted reviews', 'Real stories from real travelers.'], ['clock', 'Easy planning', 'Day-by-day itineraries.']],
      ban: ['Get weekly trip ideas', 'One email every Friday.', 'Subscribe'],
      app: { hi: 'Lisbon, 5 days', sub: 'Your next trip', card: ['Trip progress', '3 of 5 days planned', 'Next: Sintra day trip', 60], chips: ['All', 'Sights', 'Food', 'Stay'],
        items: [['Alfama walk', '9:00 AM', 'p', 1], ['Pastel de nata', '11:30 AM', 's', 1], ['Tram 28', '2:00 PM', 'a', 1], ['Sunset viewpoint', '7:30 PM', 'p', 0]] },
    },
    wellness: {
      label: 'Meditation app', brand: 'Stillwater', nav: ['Sessions', 'Teachers', 'Journal'], btn: 'Try free', pill: '7 days free',
      h: 'Find calm in ten minutes a day', p: 'Guided meditation, sleep stories, and gentle breathwork for a quieter mind.',
      b1: 'Start free trial', b2: 'Browse sessions', proof: 'Loved by 50,000 people', art: 'leaf',
      feats: [['leaf', 'Guided sessions', 'From 3 to 30 minutes.'], ['clock', 'Sleep better', 'Stories that help you drift off.'], ['heart', 'Build a habit', 'Gentle reminders, no pressure.']],
      ban: ['Take your first breath', 'Start your free week today.', 'Begin'],
      app: { hi: 'Good evening', sub: 'Stillwater', card: ['Mindful minutes', '42 min this week', 'Goal: 60 minutes', 70], chips: ['All', 'Sleep', 'Focus', 'Calm'],
        items: [['Evening unwind', '10 min', 'p', 1], ['Box breathing', '5 min', 's', 1], ['Body scan', '15 min', 'a', 1], ['Sleep story', '25 min', 'p', 0]] },
    },
  };

  /* Words in the prompt that pick an industry (first match wins) */
  const RULES = [
    ['coffee', /coffee|cafe|caf\u00e9|espresso|bakery|latte/],
    ['wedding', /wedding|bride|romantic|invite|marriage|engagement/],
    ['fitness', /fitness|\bgym\b|workout|sport|training|\brun(ning)?\b/],
    ['fintech', /fintech|bank|financ|invest|payment|crypto|budget|money/],
    ['travel', /travel|\btrip|beach|hotel|adventure|tour|vacation/],
    ['wellness', /meditat|calm|wellness|\bspa\b|sleep|mindful|yoga|health/],
  ];
  const detect = (text) => {
    const t = String(text).toLowerCase();
    const hit = RULES.find(([, re]) => re.test(t));
    return hit ? hit[0] : 'generic';
  };

  /* Mood cards, in the same order as the Moods section */
  const MOODS = ['wellness', 'generic', 'fitness', 'wedding', 'coffee', 'travel', 'generic', 'fitness'];

  return { IND, ICON, ART, detect, MOODS };
})();
