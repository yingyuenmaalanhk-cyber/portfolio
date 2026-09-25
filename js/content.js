/* ============================================================
   content.js — SINGLE SOURCE OF TRUTH for personal content.
   Everything here is extracted from the original MY.html
   (Ma Ying Yuen's personal website). No template-person data.
   ============================================================ */

export const PROFILE = {
  nameEn: 'Ma Ying Yuen',
  nameZh: '馬英源',
  roleEn: 'STEM STUDENT',
  roleZh: 'STEM 學生',
  badges: [
    { en: 'STUDENT', zh: '學生' },
    { en: 'FUTURE ENGINEER', zh: '未來工程師' },
  ],
  schoolEn: 'S.K.H. Bishop Baker Secondary School',
  schoolZh: '聖公會白約翰會督中學',
  quoteEn: 'I am a slow walker, but I never walk backwards.',
  quoteZh: '我走得很慢，但我從不後退',
};

/* Sticky notes shown on the CORKBOARD career board */
export const STICKY_NOTES = [
  {
    en: "Hello! I'm a secondary school student passionate about engineering and technology.",
    zh: '你好！我是一名中學生，熱衷於工程與科技。',
  },
  {
    en: 'Passionate about STEM — especially Spatial Data Science, AI and Engineering Technology. Curiosity keeps me moving forward.',
    zh: '熱衷 STEM，尤其是空間數據科學、人工智能與工程技術。好奇心永遠是我最強的驅動力。',
  },
  {
    en: 'Vice-head Prefect & former MiTeen Chairperson. I believe resilience and discipline are key — my goal is to become an engineer who benefits society.',
    zh: '身兼副領袖生長與 MiTeen 學會主席，堅信堅韌與紀律是成功的關鍵，目標成為造福社會的工程師。',
  },
];

/* Curated timeline on the cork board (key awards).
   medal: text badge like the template (1ST / 2ND / 3RD / MER / EXC / BRZ) */
export const TIMELINE_AWARDS = [
  { year: '2025', medal: '2ND', icon: '🥈', en: 'PolyU Build a Smart City Competition — Spatial Data Challenge in Smart City', zh: '理大「建造智慧城市比賽2025」— 智慧城市空間數據挑戰', sub: '1st Runner-up · PolyU FCE' },
  { year: '2025', medal: 'MER', icon: '🎖️', en: 'CUHK AI Hackathon 2025', zh: '中大賽馬會「智」為未來 AI Hackathon 2025', sub: 'Certificate of Merit · CUHK' },
  { year: '2024–25', medal: 'MER', icon: '🎖️', en: 'GBA Outstanding Students Award (High School Group)', zh: '粵港澳大灣區傑出學生獎（中學組）', sub: 'Merit Award · HKSMS & GBAOSA' },
  { year: '2024–25', medal: 'EXC', icon: '⭐', en: 'GBA Academic Low Altitude Flight Application Case Challenge', zh: '大灣區學術低空飛行應用案例挑戰', sub: 'Certificate of Excellence · Bay Area Hong Kong Centre' },
  { year: '2023–24', medal: '1ST', icon: '🥇', en: 'Caltex Robot Engineer Labs — HK Robotics Competition', zh: '加德士機械人工程師教室 — 全港中小學機械人比賽', sub: 'Elite Champion · Boys\' & Girls\' Clubs Association' },
  { year: '2023–24', medal: '2ND', icon: '🥈', en: 'Caltex Curling Catapult Battle (Secondary School Group)', zh: '加德士機械人 — 冰壺彈射對戰（中學組）', sub: '1st Runner-up · Boys\' & Girls\' Clubs Association' },
  { year: '2025', medal: 'MER', icon: '🎖️', en: 'Cyber Attack and Defence Elite Training cum Tournament', zh: '網絡攻防精英訓練暨攻防大賽', sub: 'Merit Award · HKIRC' },
  { year: '2024–25', medal: '2ND', icon: '🥈', en: 'STEAM Summer Camp Creative Assembly Competition', zh: 'STEAM 夏令營創意組裝比賽', sub: '2nd Runner-Up · HK Institute of Construction' },
  { year: '2022', medal: '1ST', icon: '🥇', en: 'Guangdong–Hong Kong Sister School Choral Speaking Contest', zh: '2022 粵港姊妹學校合唱誦比賽（廣州）', sub: 'The First Prize' },
  { year: '2023–24', medal: 'BRZ', icon: '🥉', en: 'Hong Kong Secondary School IT Knowledge Challenge', zh: '全港中學 IT 知識問答比賽', sub: 'Bronze Award · VTC Group' },
];

/* Skills notebook pages (keyboard hotspot) */
export const SKILL_PAGES = [
  {
    tab: { en: 'DEV SKILLS', zh: '編程技能' },
    head: { en: '// coding DEV', zh: '// 編程-開發 DEV' },
    chips: ['Python', 'C++', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    tab: { en: 'TOOLS', zh: '工具' },
    head: { en: '// toolbox TOOLS', zh: '// 常用工具 TOOLS' },
    chips: ['QGIS', 'Arduino', 'GitHub'],
  },
];

/* Abilities (from original services section) — shown on skills notebook footer */
export const ABILITIES = [
  { icon: '🗺️', en: 'Spatial Data Analysis', zh: '空間數據分析', tech: ['QGIS', 'Python', 'MySQL'] },
  { icon: '🧠', en: 'AI / ML Modeling', zh: 'AI／機器學習建模', tech: ['C++', 'Python', 'MySQL'] },
  { icon: '💻', en: 'Web Development', zh: 'Web 開發', tech: ['HTML', 'CSS', 'JavaScript'] },
];

/* Projects inside RETRO-OS (monitor hotspot) */
export const PROJECTS = [
  {
    exe: 'smart-city.exe',
    icon: 'folder',
    labelZh: '智慧城市空間數據挑戰',
    labelEn: 'Smart City Spatial Data',
    titleZh: '智慧城市空間數據挑戰「Smart City」',
    titleEn: 'Smart City Spatial Data「Smart City」',
    badge: 'PolyU',
    chips: ['Python', 'GIS', 'Data Analysis', 'Spatial Data'],
    bullets: [
      { zh: '使用 QGIS 進行空間數據處理', en: 'Spatial data processing with QGIS' },
      { zh: '採用交互式地圖展示數據分析結果', en: 'Interactive maps to present analysis results' },
      { zh: '實現數據緩存和並行處理提升性能', en: 'Caching & parallel processing for performance' },
    ],
    descEn: '1st Runner-up (2025). Led the team to use spatial data analysis to solve real urban problems, demonstrating practical skills aligned with university curriculum.',
    descZh: '獲得 2025 年 1st Runner-up（亞軍）。帶領團隊利用空間數據分析解決實際城市問題，展現了與大學課程接軌的實踐能力。',
    link: 'https://github.com/yingyuenmaalanhk-cyber/Smart-City-Competition-2025',
    linkLabel: 'github.com/yingyuenmaalanhk-cyber/Smart-City-Competition-2025',
    foot: '1st Runner-up · PolyU FCE · 2025',
  },
  {
    exe: 'ai-hackathon.exe',
    icon: 'folder',
    labelZh: 'AI for the Future',
    labelEn: 'AI for the Future',
    titleZh: 'AI for the Future「中大 AI Hackathon」',
    titleEn: 'AI for the Future「CUHK AI Hackathon」',
    badge: 'CUHK',
    chips: ['Python', 'AI', 'Data Science'],
    bullets: [
      { zh: '採用深度學習架構解決複雜問題', en: 'Deep learning architecture for complex problems' },
      { zh: '使用數據增強技術平衡數據集', en: 'Data augmentation to balance datasets' },
      { zh: '實現 GPU 加速訓練提升效率', en: 'GPU-accelerated training for efficiency' },
    ],
    descEn: 'Certificate of Merit in CUHK AI Hackathon 2025. Applied programming and AI thinking to solve complex problems.',
    descZh: '在中大賽馬會「智」為未來 AI Hackathon 2025 中獲得優異獎（Certificate of Merit）。運用編程與 AI 思維解決複雜問題。',
    link: '',
    foot: 'Certificate of Merit · CUHK · 2025',
  },
  {
    exe: 'attendance-sys.exe',
    icon: 'folder',
    labelZh: '智慧考勤系統',
    labelEn: 'Smart Attendance System',
    titleZh: '智慧考勤系統「Smart Attendance」',
    titleEn: 'Smart Attendance System「Smart Attendance」',
    badge: 'MiTeen',
    chips: ['Arduino', 'Python', 'MySQL', 'HTML/CSS'],
    bullets: [
      { zh: 'MySQL + Apache 伺服器 + 用戶端 PC 三大組件架構', en: 'MySQL + Apache web server + client PCs architecture' },
      { zh: '讀取學生 ID，成功更新時發出蜂鳴聲／閃爍 LED', en: 'Reads student IDs; beeps & flashes an LED on success' },
      { zh: '透過網頁介面存取伺服器以顯示出勤記錄', en: 'Web interface to access the server & view stored records' },
    ],
    descEn: 'The Smart Attendance System has three key components: MySQL, Apache web server and client PCs.',
    descZh: '智慧考勤系統有三個關鍵組件：MySQL、Apache web 伺服器和用戶端 PC。',
    link: 'https://miteen.hk/attendance/attlogin',
    linkLabel: 'miteen.hk/attendance/attlogin',
    foot: 'Live system · MiTeen · HK',
  },
  {
    exe: 'miteen-lab.exe',
    icon: 'folder',
    labelZh: 'MiTeen 創新項目',
    labelEn: 'MiTeen Projects',
    titleZh: 'MiTeen 學會創新項目「動手做」',
    titleEn: 'MiTeen Club Innovation Projects「Hands-on」',
    badge: 'SKH BBSS',
    chips: ['Arduino', 'Mechanical Design', 'Teamwork'],
    bullets: [
      { zh: '智能跑步機 Smart Treadmill', en: 'Smart Treadmill' },
      { zh: '自動抓娃娃機 Automatic Claw Machine', en: 'Automatic Claw Machine' },
      { zh: '投籃計分機 Basketball Scoring Machine', en: 'Basketball Scoring Machine' },
    ],
    descEn: 'As MiTeen Chairperson, led teams from conception, design and assembly to debugging — promoting a "theoretical learning + practical innovation" model.',
    descZh: '任 MiTeen 學會主席期間，帶領團隊從構思、設計、組裝到調試全程參與，推動「理論學習＋實踐創新」的發展模式。',
    link: '',
    foot: 'Led as Chairperson · 2023–2024',
  },
];

/* Full award archive — 4 tabs exactly as the original website's awards section.
   Names kept in English as in the original site. */
export const AWARD_TABS = [
  {
    id: 'partA',
    labelEn: 'International & GBA',
    labelZh: '國際與大灣區',
    titleEn: 'International Competitions & GBA Awards',
    titleZh: '國際競賽與大灣區獎項',
    rows: [
      { year: '2024–25', name: 'Merit Award in the High School Group of The Greater Bay Area Outstanding Students Award', sub: 'HKSMS & GBAOSA' },
      { year: '2024–25', name: 'Certificate of Excellence in Greater Bay Area Academic Low Altitude Flight Application Case Challenge', sub: 'Bay Area Hong Kong Centre' },
      { year: '2023–24', name: 'GBA Youth AI & Cyber Security Finals Excellence Award', sub: 'CSTCB & Judiciary Police & AiTLE' },
      { year: '2023–24', name: 'Merit Winner in Hong Kong-Macau Region\'s IHC Advanced Division', sub: 'HOPE MATH WORLD & International Hope Cup Mathematics Invitational' },
      { year: '2023–24', name: 'The Second Guangdong Hong Kong Macao Greater Bay Area STEM/AI Challenge Hong Kong Selection Competition', sub: 'Hong Kong Tech-Inno Association' },
      { year: '2023–24', name: 'Kangaroo Contest 2025', sub: 'Hong Kong Mathematics Kangaroo Contest' },
    ],
  },
  {
    id: 'partB',
    labelEn: 'Local & External',
    labelZh: '校外與本地',
    titleEn: 'Local Competitions & External Achievements',
    titleZh: '本地競賽與課外成就',
    rows: [
      { year: '2024–25', name: '2nd Runner-Up in STEAM Summer Camp Creative Assembly Competition', sub: 'Hong Kong Institute of Construction' },
      { year: '2024–25', name: 'Finalist Award in 2024 "Children Embrace AI" CODING∞ Environmental Technology Competition', sub: 'The Centum Charitas Foundation (CCF)' },
      { year: '2023–24', name: 'Merit Award in STEAM Summer Camp Creative Assembly Competition', sub: 'Hong Kong Institute of Construction' },
      { year: '2023–24', name: '4th in 2024 T.M. Youth Volleyball Competition', sub: 'Leisure and Cultural Services Department' },
      { year: '2022–23', name: 'Certificate of Participation in Outward Coach Program - Volleyball Challenge 2022', sub: 'Volleyball Association of Hong Kong, China & LCSD' },
    ],
  },
  {
    id: 'partC',
    labelEn: 'Leadership & Service',
    labelZh: '領袖與服務',
    titleEn: 'Key Positions & Community Service',
    titleZh: '校內職務與社會服務',
    rows: [
      { year: '2025–26', name: 'Monitor', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Vice-head Prefect', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Monitor', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Mathematics Club Committee Member', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Moral & Civic Ed Ambassador', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Subject Leader', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Mi Teen Academy Member', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Rock Music Club Member', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Student Mentor of the Mathematics Mentoring Scheme', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Certificate of Award in Big Brother and Sister Scheme 2024-2025', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2024–25', name: 'Certificate of Commendation in The third "Cross generational Inheritance of Love" Volunteer Care Campaign', sub: 'HK Jockey Club Charities Trust & ELCHK Social Service' },
      { year: '2023–24', name: 'Vice-head Prefect', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Chairperson of Mi Teen Academy', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Monitor', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'House Committee Member', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Football Studies Club Member', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Mathematics Club Committee Member', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Career Prefect', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Student Mentor of the Mathematics Mentoring Scheme', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Certificate of Commendation for Students with Hearts', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Certificate of Award in Big Brother and Sister Scheme 2023-2024', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'United Court Student Mentor', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'Prefect Minor', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'Student Mentor of Peer Coaching Scheme', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'Gym Manager', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'School Club Fun Fair Helper/Performer', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'Subject Leader', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'Mi Teen Academy Member', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'Certificate of Commendation for Students with Hearts', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2021–22', name: 'Certificate of Commendation for Students with Hearts', sub: 'SKH Bishop Baker Secondary School' },
    ],
  },
  {
    id: 'partD',
    labelEn: 'STEAM & Others',
    labelZh: 'STEAM 與其他',
    titleEn: 'STEAM Achievements & Other Honors',
    titleZh: 'STEAM 成就與其他獎項',
    rows: [
      { year: '2025–26', name: 'Platinum Award in "Understanding National High-Quality Development" Online Learning Activity (76th Anniversary of the PRC)', sub: 'Education Bureau' },
      { year: '2024–25', name: '1st Runner-up in the "Project: Spatial Data Challenge in Smart City" category of the PolyU FCE Build a Smart City Competition 2025', sub: 'PolyU' },
      { year: '2024–25', name: 'Merit Winner in AI Hackathon 2025', sub: 'CUHK' },
      { year: '2024–25', name: 'Merit Award in Cyber Attack and Defence Elite Training cum Tournament 2025', sub: 'HKIRC' },
      { year: '2024–25', name: 'Certification of Merit in AI Hackathon 2025', sub: 'CUHK' },
      { year: '2024–25', name: 'Certification of Participation in The 27th Hong Kong Youth Technology Innovation Competition', sub: 'HK Youth Technology Innovation Competition' },
      { year: '2023–24', name: 'Caltex Robot Engineer Labs - HK Primary & Secondary Schools Robotics Competition 2023 Elite Champion', sub: 'Boys\' & Girls\' Clubs Association of Hong Kong' },
      { year: '2023–24', name: '2nd Runner up in Timed Resource Collection', sub: 'HKIE' },
      { year: '2023–24', name: '1st Runner-up in Caltex Curling Catapult Battle Secondary School Group', sub: 'Boys\' & Girls\' Clubs Association of Hong Kong' },
      { year: '2023–24', name: '2nd Class award in 1v1 Knockout Competition', sub: 'HKIE' },
      { year: '2023–24', name: '1st Runner-Up in Caltex Robot Competition', sub: 'Boys\' & Girls\' Clubs Association of Hong Kong' },
      { year: '2023–24', name: '2nd Runner-Up in Caltex Robot Competition', sub: 'Boys\' & Girls\' Clubs Association of Hong Kong' },
      { year: '2023–24', name: 'Certification of Participation in AI x Python Coding of the Jockey Club AI Community Innovation Programme', sub: 'Jockey Club' },
      { year: '2023–24', name: 'Bronze Award in 2023 Hong Kong Secondary School IT Knowledge Challenge', sub: 'VTC Group' },
      { year: '2023–24', name: 'Certification of Participation in The 8th Elite Cup - STEAM Education Challenge', sub: 'Elite Cup - STEAM Education Challenge' },
      { year: '2023–24', name: 'Certification of Participation in 263 GT3 Virtual Challenge Student Class', sub: '263 GT3 Virtual Challenge' },
      { year: '2023–24', name: 'Progress Commendation Award in The 7th Hong Kong Youth Progress Award 2023', sub: 'Hong Kong Youth Progress Award' },
      { year: '2023–24', name: 'Academic Improvement Award', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'First in Religious Studies', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2023–24', name: 'Joint School White Path Special Training Program', sub: 'Joint School Sports Programme' },
      { year: '2022–23', name: 'Certification of Participation in Yuen Long District Secondary School Robotics Training Workshop Basic Level', sub: 'Yuen Long District Secondary School Robotics Training' },
      { year: '2022–23', name: 'Certification of Participation in Yuen Long District Secondary School Robotics Training Workshop Advanced Level', sub: 'Yuen Long District Secondary School Robotics Training' },
      { year: '2022–23', name: 'Academic Improvement Award', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'First in Computer Literacy', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2022–23', name: 'First in Chinese History', sub: 'SKH Bishop Baker Secondary School' },
      { year: '2021–22', name: 'For participating Augmented Reality Mobile Applications Development Courses in School Year 2021-22', sub: 'Augmented Reality Mobile Applications Development' },
      { year: '2021–22', name: 'Academic Improvement Award', sub: 'SKH Bishop Baker Secondary School' },
    ],
  },
];

/* Photo album (clipboard hotspot) — images & captions from the original site */
export const PHOTOS = [
  {
    src: 'https://yingyuenmaalanhk-cyber.github.io/alanmahk/Smart%20Attendance%20System.jpg',
    titleEn: 'Smart Attendance System',
    titleZh: '智能考勤系統',
    descEn: 'Track, analyze and manage student attendance with my comprehensive digital platform.',
    descZh: '使用我的綜合數位平台跟踪、分析和管理學生出勤情況。',
  },
  {
    src: 'https://www.polyu.edu.hk/fce/-/media/department/fce/content/smart-city-event/20260224_build-a-smart-city_website-banner.jpg?mh=450&mw=1920&rev=61b3a63dae9341769be26821ee1779c2&hash=D19D419668EFF22B5EDB32CDED479CEC',
    titleEn: 'Smart City Competition',
    titleZh: '智慧城市比賽',
    descEn: 'PolyU Build a Smart City Competition 2025 - 1st Runner-up',
    descZh: '理大建造智慧城市比賽 2025 — 亞軍',
  },
  {
    src: 'https://cuhkjc-aiforfuture.hk/wp-content/uploads/2025/04/AI-Hackathon-Web-Banner.jpg',
    titleEn: 'AI Hackathon',
    titleZh: 'AI 黑客松',
    descEn: 'CUHK AI Hackathon 2025 - Certificate of Merit',
    descZh: '中大 AI Hackathon 2025 — 優異獎',
  },
];

/* Contact card (business-card hotspot) — real contacts from the original site */
export const CONTACTS = {
  qrTarget: 'https://wa.me/85264399498',
  qrCaption: { en: 'SCAN ME · WHATSAPP', zh: '掃我 · WHATSAPP' },
  rows: [
    { icon: '✉', text: 'yingyuenma.alanhk@gmail.com', href: 'mailto:yingyuenma.alanhk@gmail.com' },
    { icon: '💬', text: 'WhatsApp 6439 9498', href: 'https://wa.me/85264399498' },
    { icon: '📷', text: 'instagram.com/yy.ma.walker', href: 'https://www.instagram.com/yy.ma.walker/' },
    { icon: '🔗', text: 'github.com/yingyuenmaalanhk-cyber', href: 'https://github.com/yingyuenmaalanhk-cyber' },
  ],
};

/* Boot sequence log (matches template's fake terminal boot) */
export const BOOT_LINES = [
  'booting kernel ............ OK',
  'mounting desk_scene ....... OK',
  'loading textures .......... OK',
  'calibrating CRT ........... OK',
  'initializing portfolio .... OK',
];

export const BOOT_HINT = 'TIP: CLICK THE KEYBOARD · PAPERS · CARD · SCREEN';

/* ------------------------------------------------------------------
   SITE-AS-OS information architecture
   7 "apps" — the persistent LAUNCHER navigation & guided tour.
   Order = recommended first-visit journey.
   ------------------------------------------------------------------ */
export const APPS = [
  {
    id: 'profile', num: '01', icon: '📋', file: 'PROFILE.EXE',
    en: 'PROFILE', zh: '個人簡介',
    tourEn: 'Start here. This is where you learn who I am, what I study, and what I care about.',
    tourZh: '從這裡開始。你可以在這裡認識我是誰、讀什麼、在乎什麼。',
  },
  {
    id: 'work', num: '02', icon: '🖥️', file: 'RETRO-OS.EXE',
    en: 'WORK', zh: '作品',
    tourEn: 'Next, explore what I have built. This section shows my projects, technical interests, and problem-solving work.',
    tourZh: '接著看看我造過什麼。這裡展示我的專案、技術興趣與解難作品。',
  },
  {
    id: 'journey', num: '03', icon: '🧭', file: 'JOURNEY.TXT',
    en: 'JOURNEY', zh: '成長經歷',
    tourEn: 'This is my development over time — leadership, service, and important milestones.',
    tourZh: '這是我在時間中的成長——領袖、服務與重要里程碑。',
  },
  {
    id: 'awards', num: '04', icon: '🏆', file: 'AWARDS.DB',
    en: 'AWARDS', zh: '獲獎紀錄',
    tourEn: 'Here you can explore selected awards, competitions, and accomplishments — 58+ honors in four categories.',
    tourZh: '這裡可以瀏覽我的獎項、比賽與成就——四大分類、58+ 項榮譽。',
  },
  {
    id: 'skills', num: '05', icon: '🔧', file: 'SKILLS.TXT',
    en: 'SKILLS', zh: '技能清單',
    tourEn: 'See the skills and technologies behind the projects.',
    tourZh: '看看專案背後的技能與技術。',
  },
  {
    id: 'moments', num: '06', icon: '📷', file: 'MOMENTS.JPG',
    en: 'MOMENTS', zh: '生活相簿',
    tourEn: 'This is the more personal side of the portfolio — moments, interests, and experiences.',
    tourZh: '這是作品集裡更個人的一面——時刻、興趣與經歷。',
  },
  {
    id: 'contact', num: '07', icon: '📞', file: 'CONNECT.SYS',
    en: 'CONNECT', zh: '聯絡方式',
    tourEn: 'Want to know more? This is where you can contact or connect with me.',
    tourZh: '想了解更多？這裡可以聯絡或連結我。',
  },
];

export const WELCOME = {
  title: 'MA YING YUEN OS',
  sysEn: 'SYSTEM READY · NEW USER DETECTED',
  sysZh: '系統就緒 · 偵測到新用戶',
  bodyEn: 'This portfolio is an interactive personal system — a retro desktop where every object on the desk opens a part of my story. New users can follow a guided path to understand my story step by step.',
  bodyZh: '這個作品集是一個互動式個人系統——復古桌面上每一件物件都通往我故事的一部分。新用戶可以跟隨引導路徑，逐步認識我的故事。',
  startEn: '▶ START GUIDED TOUR', startZh: '▶ 開始引導導覽',
  exploreEn: 'EXPLORE FREELY', exploreZh: '自由探索',
};

export const TOUR = {
  introTitleEn: 'GUIDED TOUR', introTitleZh: '引導導覽',
  introEn: 'The LAUNCHER on the right lists everything inside this system. Follow the numbered path, or skip and explore freely.',
  introZh: '右側的 LAUNCHER 列出了系統內的所有內容。跟著編號路徑走，或者跳過自由探索。',
  doneTitleEn: 'SYSTEM TOUR COMPLETE', doneTitleZh: '系統導覽完成',
  doneEn: "You now know the basic structure of Ma Ying Yuen's portfolio. You can restart this tour anytime with the ? TOUR button.",
  doneZh: '你已經認識這個作品集的基本結構。隨時可以按 ？TOUR 重新觀看。',
  exploreEn: 'EXPLORE PORTFOLIO', exploreZh: '開始探索作品集',
  identityEn: '01 / IDENTITY', identityZh: '01 / 身份',
  identityBodyEn: 'This is where you learn who I am, what I study, and what I care about.',
  identityBodyZh: '你在這裡認識我：姓名、學校、方向。',
  skipEn: 'SKIP TOUR', skipZh: '跳過導覽',
  nextEn: 'NEXT ▶', nextZh: '下一個 ▶',
  backEn: '◀ BACK', backZh: '◀ 上一個',
};

/* ------------------------------------------------------------------
   JOURNEY — leadership & service timeline (from the original site)
   ------------------------------------------------------------------ */
export const JOURNEY = [
  {
    tag: '2022 – 2025',
    titleEn: 'Vice-head Prefect', titleZh: '副領袖生長',
    orgEn: 'S.K.H. Bishop Baker Secondary School', orgZh: '聖公會白約翰會督中學',
    descEn: 'Assisted in maintaining discipline, winning "Model & Excellent Prefect" awards multiple times. Demonstrated reliability, integrity, and responsibility, earning the trust of teachers and peers.',
    descZh: '協助維持校園紀律，多次獲得「模範&優異領袖生」獎項。展現出高度的可靠性、誠信和責任感，並贏得了師生的信任。',
    pointsEn: ['Won "Model & Excellent Prefect" Award multiple times', 'Earned trust of teachers and peers', 'Demonstrated high reliability and responsibility'],
    pointsZh: ['多次獲得「模範&優異領袖生」獎項', '贏得師生信任', '展現高度可靠性和責任感'],
  },
  {
    tag: '2023 – 2024',
    titleEn: 'Mi Teen Chairperson', titleZh: 'Mi Teen 學會主席',
    orgEn: 'STEAM Promotion', orgZh: 'STEAM 推廣',
    descEn: 'Coordinated STEAM activities and led members to put theory into practice by developing innovative projects. Promoted a "hands-on" learning atmosphere.',
    descZh: '統籌 STEAM 活動，帶領成員將理論付諸實踐，開發創新項目。推動了「動手做」的學習氛圍。',
    pointsEn: ['Led team to develop Smart Treadmill and Basketball Scoring Machine', 'Coordinated STEAM lectures and workshops', 'Promoted "theoretical learning + practical innovation" model'],
    pointsZh: ['帶領團隊研發智能跑步機、投籃計分機等項目', '統籌策劃校內外 STEAM 講座和工作坊', '推動「理論學習+實踐創新」發展模式'],
  },
  {
    tag: '2023 – 2025',
    titleEn: 'Mentor & Big Brother', titleZh: '數學輔導員 & 學長',
    orgEn: 'Peer Support', orgZh: '朋輩支援',
    descEn: 'Served as a Mathematics Mentor and Big Brother scheme member, patiently guiding junior students in academics and school life adaptation.',
    descZh: '擔任數學學會導師及「大哥哥大姐姐」計劃成員，耐心指導低年級同學，協助他們解決學業困難並適應校園生活。',
    pointsEn: ['Participated in Big Brother/Sister Scheme', 'Patiently guided junior students', 'Helped with academic difficulties and school adaptation'],
    pointsZh: ['參與「大哥哥大姐姐計劃」', '耐心指導低年級同學', '協助解決學業困難並適應校園生活'],
  },
];


/* Interests (from original bento grid) — used on the OS "ABOUT" window if opened
   via right-icon; keeps original interest content reachable. */
export const INTERESTS = [
  { icon: '🤖', en: 'Engineering', zh: '工程與機械人', descEn: 'Overall champion and multiple awards in Caltex Robot Competition. Passionate about building and structural problem solving.', descZh: '在加德士機械人工程師教室競賽中獲得全場總冠軍及多項獎項。熱衷於動手組裝與解決結構問題。' },
  { icon: '🎬', en: 'Video Editing', zh: '影片剪輯', descEn: 'Certificate of Commendation in The third "Cross generational Inheritance of Love".', descZh: '第三屆「跨代傳承愛」短片創作比賽嘉許狀' },
  { icon: '📷', en: 'Photography', zh: '攝影', descEn: 'Certificate of Commendation in The third "Cross generational Inheritance of Love".', descZh: '第三屆「跨代傳承愛」攝影比賽嘉許狀' },
  { icon: '🎤', en: 'Recitation', zh: '朗誦', descEn: 'The First Prize in 2022 Guangdong-Hong Kong Sister School Choral Speaking Contest (Guangzhou).', descZh: '2022 粵港姊妹學校合唱誦比賽一等獎（廣州）' },
  { icon: '⚽', en: 'Football', zh: '足球', descEn: 'Football Studies Club Member.', descZh: '足球學會成員' },
  { icon: '💻', en: 'AI Application', zh: 'AI 應用', descEn: 'Merit in AI Hackathon.', descZh: '在中大 AI Hackathon 獲優異獎' },
  { icon: '🏐', en: 'Volleyball', zh: '排球', descEn: '4th in T.M. Youth Cup (2024).', descZh: '屯門青年盃殿軍 (2024)' },
  { icon: '🤝', en: 'Volunteering', zh: '義工服務', descEn: 'Big Brother/Sister Scheme & Math Mentor.', descZh: '參與大哥哥大姐姐計劃及數學輔導' },
  { icon: '📍', en: 'Location', zh: '位置', descEn: 'Based in Hong Kong.', descZh: '基於香港' },
  { icon: '👥', en: 'MiTeen Club', zh: 'MiTeen 學會', descEn: 'Former Chairperson. Led team to develop Smart Treadmill and Basketball Scoring Machine.', descZh: '曾任主席，帶領團隊研發智能跑步機、投籃計分機等項目' },
];
