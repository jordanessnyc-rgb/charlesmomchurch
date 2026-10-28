import type {
  AnnouncementItem,
  Collections,
  EventItem,
  ImpactStat,
  LeaderItem,
  MediaItem,
  MinistryItem,
  ProjectItem,
  SiteSettings,
  StoryItem,
  TestimonialItem,
} from "./types";

/**
 * Default content used when the database is empty or not configured.
 * Everything here is editable from the admin dashboard (/admin) once a database is connected.
 * Text is bilingual: { en, es }.
 */

export const defaultSettings: SiteSettings = {
  churchName: "Casa de Milagros",
  legalName: "Centro de Adoración e Intercesión Casa de Milagros",
  tagline: { en: "A house of worship, prayer, and love in action", es: "Una casa de adoración, oración y amor en acción" },
  address: { line1: "", line2: "", city: "New York", state: "NY", zip: "" },
  mapsQuery: "Centro de Adoración e Intercesión Casa de Milagros, New York, NY",
  phone: "",
  whatsapp: "",
  email: "info@casademilagros.org",
  emails: { general: "", prayer: "", assistance: "", sponsorship: "", volunteer: "" },
  social: { facebook: "", instagram: "", youtube: "", tiktok: "", whatsapp: "" },
  youtubeChannelUrl: "",
  youtubeLiveEmbedId: "",
  livestreamUrl: "",
  zoomUrl: "",
  zoomNote: {
    en: "Our online prayer meetings are hosted on Zoom. The link is also shared in our WhatsApp community.",
    es: "Nuestras reuniones de oración en línea son por Zoom. El enlace también se comparte en nuestra comunidad de WhatsApp.",
  },
  serviceTimes: [
    {
      id: "sunday",
      type: "worship",
      label: { en: "Sunday Worship Service", es: "Servicio de adoración dominical" },
      day: { en: "Sunday", es: "Domingo" },
      time: "11:00 AM",
      location: { en: "Main sanctuary", es: "Santuario principal" },
      online: false,
    },
    {
      id: "friday",
      type: "worship",
      label: { en: "Friday Night of Worship & Intercession", es: "Viernes de adoración e intercesión" },
      day: { en: "Friday", es: "Viernes" },
      time: "7:30 PM",
      location: { en: "Main sanctuary", es: "Santuario principal" },
      online: false,
    },
    {
      id: "prayer-online",
      type: "prayer",
      label: { en: "Morning Prayer (online)", es: "Oración de la mañana (en línea)" },
      day: { en: "Monday – Friday", es: "Lunes a viernes" },
      time: "6:00 AM",
      location: { en: "Zoom", es: "Zoom" },
      online: true,
    },
    {
      id: "bible",
      type: "bible",
      label: { en: "Bible Study & Discipleship", es: "Estudio bíblico y discipulado" },
      day: { en: "Wednesday", es: "Miércoles" },
      time: "7:30 PM",
      location: { en: "In person & online", es: "Presencial y en línea" },
      online: true,
    },
  ],
  heroImage: "",
  heroVideoUrl: "",
  welcomeMessage: {
    en: "Welcome to Casa de Milagros. We are a family of believers who worship with passion, intercede with faith, and serve our community with love. Whether you are looking for a church home, need prayer, or need a helping hand, our doors and our hearts are open to you.",
    es: "Bienvenido a Casa de Milagros. Somos una familia de creyentes que adora con pasión, intercede con fe y sirve a su comunidad con amor. Si buscas una iglesia, necesitas oración o necesitas una mano amiga, nuestras puertas y nuestros corazones están abiertos para ti.",
  },
  mission: {
    en: "To worship God, intercede for our city, make disciples of Jesus Christ, strengthen families, and serve our neighbors in need with tangible acts of love.",
    es: "Adorar a Dios, interceder por nuestra ciudad, hacer discípulos de Jesucristo, fortalecer a las familias y servir a nuestros vecinos necesitados con actos tangibles de amor.",
  },
  vision: {
    en: "To be a house of miracles in New York: a center of worship and intercession where lives are transformed, families are restored, and the community experiences the love of God in action.",
    es: "Ser una casa de milagros en Nueva York: un centro de adoración e intercesión donde las vidas son transformadas, las familias restauradas y la comunidad experimenta el amor de Dios en acción.",
  },
  history: {
    en: "Casa de Milagros began as a small group of families gathering to pray and worship together in New York. What started in a living room grew into a congregation with a clear calling: to be a center of adoration and intercession for our city.\n\nFrom the beginning, prayer and service have gone hand in hand. As the church grew, so did our outreach: food distributions, clothing drives, support for families in crisis, and discipleship for new believers.\n\nToday we continue to gather, pray, and serve with the same conviction, believing that God still does miracles and that His love is best shown through a community that cares.",
    es: "Casa de Milagros comenzó como un pequeño grupo de familias que se reunían para orar y adorar juntas en Nueva York. Lo que empezó en una sala se convirtió en una congregación con un llamado claro: ser un centro de adoración e intercesión para nuestra ciudad.\n\nDesde el principio, la oración y el servicio han ido de la mano. A medida que la iglesia creció, también creció nuestra labor comunitaria: entregas de alimentos, campañas de ropa, apoyo a familias en crisis y discipulado para nuevos creyentes.\n\nHoy seguimos reuniéndonos, orando y sirviendo con la misma convicción, creyendo que Dios sigue haciendo milagros y que Su amor se muestra mejor a través de una comunidad que se preocupa por los demás.",
  },
  beliefs: [
    {
      title: { en: "The Word of God", es: "La Palabra de Dios" },
      text: { en: "We believe the Bible is the inspired Word of God and our final authority for faith and life.", es: "Creemos que la Biblia es la Palabra inspirada de Dios y nuestra autoridad final para la fe y la vida." },
    },
    {
      title: { en: "Jesus Christ", es: "Jesucristo" },
      text: { en: "We believe in Jesus Christ, Son of God, who died and rose again so that all who believe may have eternal life.", es: "Creemos en Jesucristo, Hijo de Dios, que murió y resucitó para que todo el que cree tenga vida eterna." },
    },
    {
      title: { en: "The Holy Spirit", es: "El Espíritu Santo" },
      text: { en: "We believe in the presence and power of the Holy Spirit, who guides, comforts, heals, and empowers the church.", es: "Creemos en la presencia y el poder del Espíritu Santo, que guía, consuela, sana y capacita a la iglesia." },
    },
    {
      title: { en: "Prayer & Intercession", es: "Oración e intercesión" },
      text: { en: "We believe prayer changes things. Intercession for our families, city, and nations is at the heart of who we are.", es: "Creemos que la oración cambia las cosas. La intercesión por nuestras familias, ciudad y naciones está en el corazón de quienes somos." },
    },
    {
      title: { en: "Family", es: "La familia" },
      text: { en: "We believe the family is God's design and we are committed to strengthening and restoring families.", es: "Creemos que la familia es el diseño de Dios y estamos comprometidos a fortalecer y restaurar las familias." },
    },
    {
      title: { en: "Love in Action", es: "Amor en acción" },
      text: { en: "We believe faith without works is dead. Serving the poor, the stranger, and the hurting is our worship made visible.", es: "Creemos que la fe sin obras es muerta. Servir al pobre, al extranjero y al que sufre es nuestra adoración hecha visible." },
    },
  ],
  parking: {
    en: "Free street parking is available around the building. Please allow a few extra minutes on Sunday mornings. Accessible parking and entrance are available; let us know ahead of time if you need assistance.",
    es: "Hay estacionamiento gratuito en la calle alrededor del edificio. Te recomendamos llegar con unos minutos de anticipación los domingos. Contamos con estacionamiento y entrada accesibles; avísanos con anticipación si necesitas ayuda.",
  },
  whatToExpect: {
    en: "Expect a warm welcome, passionate worship, and a message from the Bible that speaks to everyday life. Services last about two hours and are held in Spanish with English available. Dress is casual. Children are welcome in the service and in our children's ministry. You will never be singled out or asked to give.",
    es: "Espera una cálida bienvenida, adoración apasionada y un mensaje bíblico que habla a la vida diaria. Los servicios duran unas dos horas y se realizan en español con inglés disponible. La vestimenta es casual. Los niños son bienvenidos en el servicio y en nuestro ministerio infantil. Nunca te señalaremos ni te pediremos que ofrendes.",
  },
  officeHours: { en: "Tuesday – Friday, 10:00 AM – 4:00 PM", es: "Martes a viernes, 10:00 AM – 4:00 PM" },
  givingExplanation: {
    en: "Your giving sustains our worship services and facilities, supports pastoral care and discipleship, and funds our Love in Action outreach: food and essential supplies for families, clothing drives, emergency assistance, and community events. A portion of every undesignated gift goes directly to community outreach.",
    es: "Tus ofrendas sostienen nuestros servicios e instalaciones, apoyan el cuidado pastoral y el discipulado, y financian nuestra labor Amor en Acción: alimentos y artículos esenciales para familias, campañas de ropa, ayuda de emergencia y eventos comunitarios. Una parte de cada ofrenda no designada va directamente a la labor comunitaria.",
  },
  funds: [
    { id: "general", name: { en: "General fund (where needed most)", es: "Fondo general (donde más se necesite)" }, description: { en: "Worship, ministry, and operations.", es: "Adoración, ministerios y operaciones." } },
    { id: "outreach", name: { en: "Love in Action outreach", es: "Labor comunitaria Amor en Acción" }, description: { en: "Food, clothing, and assistance for families.", es: "Alimentos, ropa y ayuda para familias." } },
    { id: "building", name: { en: "Future church facility", es: "Futuro templo" }, description: { en: "A permanent home for our church and community programs.", es: "Un hogar permanente para nuestra iglesia y sus programas comunitarios." } },
    { id: "missions", name: { en: "Missions", es: "Misiones" }, description: { en: "Supporting missionaries and churches abroad.", es: "Apoyo a misioneros e iglesias en el extranjero." } },
  ],
  otherWaysToGive: {
    en: "You can also give in person during any service, by Zelle, or by mailing a check payable to the church. Contact us for details on donating goods, vehicles, or stock.",
    es: "También puedes ofrendar en persona durante cualquier servicio, por Zelle o enviando un cheque a nombre de la iglesia. Contáctanos para donar bienes, vehículos o acciones.",
  },
  letterOfNeed: {
    title: { en: "Letter of Need", es: "Carta de necesidad" },
    body: {
      en: "To whom it may concern,\n\nCentro de Adoración e Intercesión Casa de Milagros is a faith-based community organization serving families in New York. Beyond our worship services, we operate ongoing charitable programs: food and essential supply distributions, clothing drives, emergency assistance for families in crisis, and spiritual and emotional support for anyone who walks through our doors.\n\nThe need in our community continues to grow. Many of the families we serve are working families who struggle to cover rent, groceries, and basic necessities. We currently serve them from rented space with limited storage and capacity.\n\nWe are seeking partners who can help us (1) sustain and expand our monthly food and supply distributions, (2) cover the cost of our current meeting space, and (3) move toward a permanent facility that can house our worship services, a community resource center, and our outreach programs under one roof.\n\nAny contribution, whether financial, in-kind, or professional services, makes a direct difference in the lives of real families. We would be honored to share more about our work and to recognize your partnership.\n\nWith gratitude,",
      es: "A quien corresponda:\n\nEl Centro de Adoración e Intercesión Casa de Milagros es una organización comunitaria basada en la fe que sirve a familias en Nueva York. Además de nuestros servicios de adoración, mantenemos programas caritativos continuos: entregas de alimentos y artículos esenciales, campañas de ropa, ayuda de emergencia para familias en crisis y apoyo espiritual y emocional para toda persona que cruza nuestras puertas.\n\nLa necesidad en nuestra comunidad sigue creciendo. Muchas de las familias que servimos son familias trabajadoras que luchan para cubrir la renta, la comida y las necesidades básicas. Actualmente las atendemos desde un espacio alquilado con capacidad y almacenamiento limitados.\n\nBuscamos aliados que nos ayuden a (1) sostener y ampliar nuestras entregas mensuales de alimentos y artículos, (2) cubrir el costo de nuestro espacio de reunión actual y (3) avanzar hacia un templo permanente que albergue nuestros servicios, un centro de recursos comunitarios y nuestros programas de ayuda bajo un mismo techo.\n\nToda contribución, ya sea económica, en especie o de servicios profesionales, hace una diferencia directa en la vida de familias reales. Sería un honor compartir más sobre nuestra labor y reconocer su colaboración.\n\nCon gratitud,",
    },
    signatory: "Pastoral Leadership",
    signatoryTitle: { en: "Centro de Adoración e Intercesión Casa de Milagros", es: "Centro de Adoración e Intercesión Casa de Milagros" },
    date: "",
  },
  letterOfNeedPdfUrl: "",
  currentNeeds: [
    { title: { en: "Monthly food & supply distributions", es: "Entregas mensuales de alimentos y artículos" }, text: { en: "Non-perishable food, diapers, hygiene products, and the vehicle and storage costs to distribute them.", es: "Alimentos no perecederos, pañales, productos de higiene y los costos de vehículo y almacenamiento para distribuirlos." } },
    { title: { en: "Meeting space", es: "Espacio de reunión" }, text: { en: "Rent and utilities for the space where we worship and serve each week.", es: "Renta y servicios del espacio donde adoramos y servimos cada semana." } },
    { title: { en: "Sound & media equipment", es: "Equipo de sonido y medios" }, text: { en: "To livestream services and reach members who cannot attend in person.", es: "Para transmitir los servicios en vivo y llegar a los miembros que no pueden asistir en persona." } },
    { title: { en: "Children's & youth programs", es: "Programas de niños y jóvenes" }, text: { en: "Materials, snacks, and activities for the next generation.", es: "Materiales, meriendas y actividades para la próxima generación." } },
  ],
  futureFacility: {
    en: "We are praying and working toward a permanent church facility: a sanctuary for worship, classrooms for the Bible institute and children's ministry, and a community resource center with a food pantry and clothing closet. A permanent home will let us serve more families, more consistently, for decades to come.",
    es: "Estamos orando y trabajando por un templo permanente: un santuario para la adoración, aulas para el instituto bíblico y el ministerio infantil, y un centro de recursos comunitarios con despensa de alimentos y ropero. Un hogar permanente nos permitirá servir a más familias, con más constancia, por décadas.",
  },
  corporateSponsorship: {
    en: "Businesses and organizations can sponsor a food distribution, a community event, a ministry program, or the future facility. Sponsors are recognized on our website, at events, and in our communications, and receive an impact report showing exactly how their support was used. We are glad to tailor a partnership to your goals.",
    es: "Empresas y organizaciones pueden patrocinar una entrega de alimentos, un evento comunitario, un programa ministerial o el futuro templo. Los patrocinadores son reconocidos en nuestro sitio web, en los eventos y en nuestras comunicaciones, y reciben un informe de impacto que muestra exactamente cómo se usó su apoyo. Con gusto adaptamos la colaboración a sus objetivos.",
  },
  whoWeServe: {
    en: "We serve working families, single parents, seniors, immigrants, and anyone in our neighborhood facing a hard season. No one is asked about their background or beliefs to receive help. Many of the families we serve first came to us for groceries and found a community.",
    es: "Servimos a familias trabajadoras, madres y padres solteros, adultos mayores, inmigrantes y a cualquier persona de nuestro vecindario que atraviesa una temporada difícil. A nadie se le pregunta por su origen o creencias para recibir ayuda. Muchas de las familias que servimos llegaron por alimentos y encontraron una comunidad.",
  },
  waysToContribute: {
    en: "Give financially (one-time or monthly), donate non-perishable food, diapers, or new clothing, sponsor a distribution or event, offer professional services, or volunteer your time. Businesses can also run a collection drive with their team.",
    es: "Aporta económicamente (una vez o mensualmente), dona alimentos no perecederos, pañales o ropa nueva, patrocina una entrega o un evento, ofrece servicios profesionales o dona tu tiempo. Las empresas también pueden organizar una colecta con su equipo.",
  },
  privacyPolicy: {
    en: "## Who we are\nCentro de Adoración e Intercesión Casa de Milagros (\"we\", \"us\") operates this website.\n\n## What we collect\nWhen you submit a form (prayer request, assistance request, visitor registration, volunteer sign-up, sponsorship or contact inquiry, event registration, testimony), we collect the information you provide, such as your name, email, phone number, and the content of your message. When you donate, payment details are collected and processed by Stripe; we never see or store your full card number. We also collect basic, anonymous website analytics (pages visited, device type).\n\n## How we use it\nWe use your information only to respond to your request, to pray for you, to provide assistance, to send you the confirmation email for your submission, to issue donation receipts, and to communicate about church activities if you ask us to. We do not sell or rent your information.\n\n## Confidentiality\nPrayer and assistance requests are shared only with the designated church team responsible for them. Requests marked confidential are not shared beyond that team. Testimonies are only published with your explicit permission.\n\n## Storage and security\nSubmissions are stored in a secure database with access limited to authorized church staff. We use HTTPS encryption for all traffic.\n\n## Your rights\nYou may ask us to see, correct, or delete the personal information we hold about you by contacting us at the email listed on our Contact page.\n\n## Children\nOur forms are intended for adults. Parents or guardians should submit requests on behalf of minors.\n\n## Changes\nWe may update this policy from time to time. The date of the latest update is shown above.",
    es: "## Quiénes somos\nEl Centro de Adoración e Intercesión Casa de Milagros (\"nosotros\") opera este sitio web.\n\n## Qué recopilamos\nCuando envías un formulario (petición de oración, solicitud de ayuda, registro de visitante, inscripción de voluntario, consulta de patrocinio o contacto, inscripción a eventos, testimonio), recopilamos la información que proporcionas, como tu nombre, correo electrónico, teléfono y el contenido de tu mensaje. Cuando donas, los datos de pago son recopilados y procesados por Stripe; nunca vemos ni almacenamos tu número de tarjeta completo. También recopilamos estadísticas básicas y anónimas del sitio (páginas visitadas, tipo de dispositivo).\n\n## Cómo la usamos\nUsamos tu información únicamente para responder a tu solicitud, orar por ti, brindarte ayuda, enviarte el correo de confirmación de tu envío, emitir recibos de donación y comunicarte actividades de la iglesia si así lo pides. No vendemos ni alquilamos tu información.\n\n## Confidencialidad\nLas peticiones de oración y las solicitudes de ayuda se comparten solo con el equipo de la iglesia designado para atenderlas. Las peticiones marcadas como confidenciales no se comparten fuera de ese equipo. Los testimonios solo se publican con tu permiso explícito.\n\n## Almacenamiento y seguridad\nLos envíos se guardan en una base de datos segura con acceso limitado al personal autorizado de la iglesia. Usamos cifrado HTTPS para todo el tráfico.\n\n## Tus derechos\nPuedes pedirnos ver, corregir o eliminar la información personal que tenemos sobre ti escribiendo al correo indicado en nuestra página de Contacto.\n\n## Menores\nNuestros formularios están destinados a adultos. Los padres o tutores deben enviar solicitudes en nombre de los menores.\n\n## Cambios\nPodemos actualizar esta política ocasionalmente. La fecha de la última actualización aparece arriba.",
  },
  privacyUpdated: "2026-10-28",
  impactUpdated: "2026-10-01",
  gallery: [],
  outreachGallery: [],
};

function nextWeekday(weekday: number, hour: number, minute = 0, weeksAhead = 0): string {
  const d = new Date();
  const diff = (weekday - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff + weeksAhead * 7);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function plusHours(iso: string, hours: number): string {
  return new Date(new Date(iso).getTime() + hours * 3600_000).toISOString();
}

const ev1 = nextWeekday(6, 10, 0, 1);
const ev2 = nextWeekday(5, 19, 30, 2);
const ev3 = nextWeekday(0, 11, 0, 4);

export const defaultEvents: EventItem[] = [
  {
    id: "food-distribution",
    sort: 1,
    published: true,
    slug: "community-food-distribution",
    title: { en: "Community Food Distribution", es: "Entrega comunitaria de alimentos" },
    description: {
      en: "Free groceries and essential supplies for families in need. No registration required to receive food. Volunteers: please arrive at 8:30 AM to help set up.",
      es: "Alimentos y artículos esenciales gratuitos para familias necesitadas. No se requiere inscripción para recibir alimentos. Voluntarios: por favor lleguen a las 8:30 AM para ayudar a preparar.",
    },
    startsAt: ev1,
    endsAt: plusHours(ev1, 3),
    location: { en: "Church entrance", es: "Entrada de la iglesia" },
    online: false,
    link: "",
    image: "",
    category: "outreach",
    registration: true,
    featured: true,
  },
  {
    id: "night-of-worship",
    sort: 2,
    published: true,
    slug: "night-of-worship-and-miracles",
    title: { en: "Night of Worship & Miracles", es: "Noche de adoración y milagros" },
    description: {
      en: "A special evening of extended worship, intercession, and prayer for healing. Everyone is welcome; bring a friend who needs a miracle.",
      es: "Una noche especial de adoración extendida, intercesión y oración por sanidad. Todos son bienvenidos; trae a un amigo que necesite un milagro.",
    },
    startsAt: ev2,
    endsAt: plusHours(ev2, 3),
    location: { en: "Main sanctuary", es: "Santuario principal" },
    online: true,
    link: "",
    image: "",
    category: "service",
    registration: false,
    featured: true,
  },
  {
    id: "family-conference",
    sort: 3,
    published: true,
    slug: "family-conference",
    title: { en: "Family Restoration Conference", es: "Conferencia de restauración familiar" },
    description: {
      en: "A one-day conference for couples, parents, and families with teaching, worship, workshops, and prayer. Lunch included. Childcare available with registration.",
      es: "Una conferencia de un día para parejas, padres y familias con enseñanza, adoración, talleres y oración. Incluye almuerzo. Cuidado de niños disponible con inscripción.",
    },
    startsAt: ev3,
    endsAt: plusHours(ev3, 6),
    location: { en: "Main sanctuary", es: "Santuario principal" },
    online: false,
    link: "",
    image: "",
    category: "conference",
    registration: true,
    featured: false,
  },
];

export const defaultAnnouncements: AnnouncementItem[] = [
  {
    id: "welcome",
    sort: 1,
    published: true,
    title: { en: "New website!", es: "¡Nuevo sitio web!" },
    text: {
      en: "Welcome to our new digital home. Here you can request prayer, ask for assistance, plan your visit, and support our mission.",
      es: "Bienvenido a nuestro nuevo hogar digital. Aquí puedes pedir oración, solicitar ayuda, planificar tu visita y apoyar nuestra misión.",
    },
    link: "",
    date: new Date().toISOString().slice(0, 10),
  },
  {
    id: "food-drive",
    sort: 2,
    published: true,
    title: { en: "Food drive: we need non-perishables", es: "Colecta de alimentos: necesitamos no perecederos" },
    text: {
      en: "Bring rice, beans, pasta, canned goods, and diapers to any service this month. Everything goes to families in our neighborhood.",
      es: "Trae arroz, frijoles, pasta, enlatados y pañales a cualquier servicio este mes. Todo va a familias de nuestro vecindario.",
    },
    link: "/love-in-action",
    date: new Date().toISOString().slice(0, 10),
  },
];

export const defaultMinistries: MinistryItem[] = [
  {
    id: "children",
    sort: 1,
    published: true,
    slug: "children",
    name: { en: "Children's Ministry", es: "Ministerio de niños" },
    summary: { en: "A safe, joyful place where kids learn about Jesus.", es: "Un lugar seguro y alegre donde los niños aprenden de Jesús." },
    description: {
      en: "Our children's ministry serves kids from infancy through elementary school during Sunday services. Each class combines Bible stories, worship, crafts, and games with trained, screened volunteers.",
      es: "Nuestro ministerio de niños atiende a niños desde bebés hasta primaria durante los servicios dominicales. Cada clase combina historias bíblicas, adoración, manualidades y juegos con voluntarios capacitados y verificados.",
    },
    activities: { en: "Sunday classes, Vacation Bible School, Christmas program, family outings", es: "Clases dominicales, Escuela Bíblica de Vacaciones, programa navideño, paseos familiares" },
    schedule: { en: "Sundays during the 11:00 AM service", es: "Domingos durante el servicio de 11:00 AM" },
    leader: "",
    contactEmail: "",
    image: "",
    gallery: "",
    registration: true,
  },
  {
    id: "youth",
    sort: 2,
    published: true,
    slug: "youth",
    name: { en: "Youth Ministry", es: "Ministerio de jóvenes" },
    summary: { en: "Teens and young adults growing in faith and friendship.", es: "Adolescentes y jóvenes creciendo en fe y amistad." },
    description: {
      en: "A community for middle school, high school, and young adults to grow in faith, build real friendships, serve the city, and discover their purpose.",
      es: "Una comunidad para adolescentes y jóvenes adultos donde crecer en la fe, construir amistades verdaderas, servir a la ciudad y descubrir su propósito.",
    },
    activities: { en: "Friday youth nights, retreats, outreach projects, worship team", es: "Noches de jóvenes los viernes, retiros, proyectos comunitarios, equipo de adoración" },
    schedule: { en: "Fridays 7:30 PM", es: "Viernes 7:30 PM" },
    leader: "",
    contactEmail: "",
    image: "",
    gallery: "",
    registration: true,
  },
  {
    id: "women",
    sort: 3,
    published: true,
    slug: "women",
    name: { en: "Women's Ministry", es: "Ministerio de mujeres" },
    summary: { en: "Women encouraging one another in prayer, the Word, and life.", es: "Mujeres animándose unas a otras en la oración, la Palabra y la vida." },
    description: {
      en: "Monthly gatherings, Bible studies, and prayer circles where women of all ages find friendship, mentoring, and support through every season of life.",
      es: "Reuniones mensuales, estudios bíblicos y círculos de oración donde mujeres de todas las edades encuentran amistad, mentoría y apoyo en cada etapa de la vida.",
    },
    activities: { en: "Monthly breakfast, Bible study, prayer circles, annual conference", es: "Desayuno mensual, estudio bíblico, círculos de oración, conferencia anual" },
    schedule: { en: "First Saturday of the month, 10:00 AM", es: "Primer sábado del mes, 10:00 AM" },
    leader: "",
    contactEmail: "",
    image: "",
    gallery: "",
    registration: true,
  },
  {
    id: "prayer",
    sort: 4,
    published: true,
    slug: "prayer-intercession",
    name: { en: "Prayer & Intercession", es: "Oración e intercesión" },
    summary: { en: "The engine of our church: praying for our families, city, and nations.", es: "El motor de nuestra iglesia: orando por nuestras familias, ciudad y naciones." },
    description: {
      en: "Our intercessors pray daily over every request submitted to the church, lead the online morning prayer, and cover every service and outreach in prayer.",
      es: "Nuestros intercesores oran diariamente por cada petición enviada a la iglesia, dirigen la oración matutina en línea y cubren en oración cada servicio y actividad comunitaria.",
    },
    activities: { en: "Daily online prayer, prayer chain, intercession nights, prayer for the sick", es: "Oración diaria en línea, cadena de oración, noches de intercesión, oración por los enfermos" },
    schedule: { en: "Monday – Friday 6:00 AM on Zoom; Friday nights", es: "Lunes a viernes 6:00 AM por Zoom; viernes por la noche" },
    leader: "",
    contactEmail: "",
    image: "",
    gallery: "",
    registration: true,
  },
  {
    id: "worship",
    sort: 5,
    published: true,
    slug: "worship",
    name: { en: "Worship Ministry", es: "Ministerio de adoración" },
    summary: { en: "Musicians, singers, and creatives leading the church into God's presence.", es: "Músicos, cantantes y creativos guiando a la iglesia a la presencia de Dios." },
    description: {
      en: "Our worship team leads every service with passion and excellence. We welcome vocalists, instrumentalists, sound and media technicians who want to serve with their gifts.",
      es: "Nuestro equipo de adoración dirige cada servicio con pasión y excelencia. Damos la bienvenida a vocalistas, instrumentistas y técnicos de sonido y medios que quieran servir con sus dones.",
    },
    activities: { en: "Weekly rehearsals, worship nights, recordings", es: "Ensayos semanales, noches de adoración, grabaciones" },
    schedule: { en: "Rehearsals Thursdays 7:30 PM", es: "Ensayos los jueves 7:30 PM" },
    leader: "",
    contactEmail: "",
    image: "",
    gallery: "",
    registration: true,
  },
  {
    id: "institute",
    sort: 6,
    published: true,
    slug: "bible-institute",
    name: { en: "Bible Institute & Discipleship", es: "Instituto bíblico y discipulado" },
    summary: { en: "Grow deep roots in the Word through structured classes and mentoring.", es: "Echa raíces profundas en la Palabra con clases estructuradas y mentoría." },
    description: {
      en: "From new-believer foundations to leadership training, our Bible institute offers structured courses, small groups, and one-on-one discipleship for every stage of the journey.",
      es: "Desde los fundamentos para nuevos creyentes hasta la formación de líderes, nuestro instituto bíblico ofrece cursos estructurados, grupos pequeños y discipulado personal para cada etapa del camino.",
    },
    activities: { en: "Foundations course, doctrine classes, leadership track, small groups", es: "Curso de fundamentos, clases de doctrina, formación de líderes, grupos pequeños" },
    schedule: { en: "Wednesdays 7:30 PM, in person and online", es: "Miércoles 7:30 PM, presencial y en línea" },
    leader: "",
    contactEmail: "",
    image: "",
    gallery: "",
    registration: true,
  },
  {
    id: "outreach",
    sort: 7,
    published: true,
    slug: "community-outreach",
    name: { en: "Community Outreach", es: "Labor comunitaria" },
    summary: { en: "Love in action: food, clothing, and support for families in need.", es: "Amor en acción: alimentos, ropa y apoyo para familias necesitadas." },
    description: {
      en: "Our outreach team organizes food distributions, clothing drives, visits to families, and partnerships with local organizations so that no neighbor goes without help.",
      es: "Nuestro equipo de labor comunitaria organiza entregas de alimentos, campañas de ropa, visitas a familias y alianzas con organizaciones locales para que ningún vecino se quede sin ayuda.",
    },
    activities: { en: "Monthly food distribution, clothing closet, holiday baskets, family visits", es: "Entrega mensual de alimentos, ropero, canastas navideñas, visitas a familias" },
    schedule: { en: "Monthly distributions; volunteer meetings as scheduled", es: "Entregas mensuales; reuniones de voluntarios según calendario" },
    leader: "",
    contactEmail: "",
    image: "",
    gallery: "",
    registration: true,
  },
];

export const defaultProjects: ProjectItem[] = [
  {
    id: "monthly-food",
    sort: 1,
    published: true,
    slug: "monthly-food-distribution",
    title: { en: "Monthly Food Distribution", es: "Entrega mensual de alimentos" },
    description: {
      en: "Every month we distribute groceries and essential supplies to families in our neighborhood. Each box feeds a family for about a week.",
      es: "Cada mes entregamos alimentos y artículos esenciales a familias de nuestro vecindario. Cada caja alimenta a una familia por aproximadamente una semana.",
    },
    needs: { en: "Non-perishable food, diapers, hygiene products, volunteers, and funds for transportation.", es: "Alimentos no perecederos, pañales, productos de higiene, voluntarios y fondos para transporte." },
    image: "",
    goalCents: 500000,
    raisedCents: 0,
    fundId: "outreach",
    active: true,
  },
  {
    id: "clothing-closet",
    sort: 2,
    published: true,
    slug: "clothing-closet",
    title: { en: "Clothing Closet", es: "Ropero comunitario" },
    description: {
      en: "Clean, seasonal clothing for children and adults, with a special focus on winter coats and school uniforms.",
      es: "Ropa limpia y de temporada para niños y adultos, con énfasis especial en abrigos de invierno y uniformes escolares.",
    },
    needs: { en: "New or gently used clothing, winter coats, shoes, storage shelving.", es: "Ropa nueva o en buen estado, abrigos de invierno, zapatos, estantería de almacenamiento." },
    image: "",
    goalCents: 150000,
    raisedCents: 0,
    fundId: "outreach",
    active: true,
  },
  {
    id: "future-home",
    sort: 3,
    published: true,
    slug: "future-church-home",
    title: { en: "A Permanent Home", es: "Un hogar permanente" },
    description: {
      en: "A permanent facility for worship, the Bible institute, children's programs, and a community resource center with a food pantry.",
      es: "Un templo permanente para la adoración, el instituto bíblico, programas infantiles y un centro de recursos comunitarios con despensa de alimentos.",
    },
    needs: { en: "Major gifts, corporate sponsors, real estate and construction professionals.", es: "Donaciones mayores, patrocinadores corporativos, profesionales de bienes raíces y construcción." },
    image: "",
    goalCents: 0,
    raisedCents: 0,
    fundId: "building",
    active: true,
  },
];

export const defaultImpactStats: ImpactStat[] = [
  { id: "families", sort: 1, published: true, label: { en: "Families assisted", es: "Familias asistidas" }, value: "250+", icon: "families" },
  { id: "events", sort: 2, published: true, label: { en: "Community outreach events", es: "Eventos comunitarios" }, value: "24", icon: "events" },
  { id: "volunteers", sort: 3, published: true, label: { en: "Volunteers involved", es: "Voluntarios" }, value: "60+", icon: "volunteers" },
  { id: "supplies", sort: 4, published: true, label: { en: "Food & supply boxes distributed", es: "Cajas de alimentos y artículos entregadas" }, value: "1,200+", icon: "supplies" },
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: "t1",
    sort: 1,
    published: true,
    name: "María",
    quote: {
      en: "I came for a box of food and found a family. They prayed with me, helped me with my kids' school supplies, and never asked for anything in return.",
      es: "Vine por una caja de comida y encontré una familia. Oraron conmigo, me ayudaron con los útiles escolares de mis hijos y nunca pidieron nada a cambio.",
    },
    context: { en: "Mother of three", es: "Madre de tres" },
    image: "",
  },
  {
    id: "t2",
    sort: 2,
    published: true,
    name: "Carlos",
    quote: {
      en: "After I lost my job, the church helped us cover groceries for two months. Today I volunteer at every distribution.",
      es: "Después de perder mi trabajo, la iglesia nos ayudó con la comida por dos meses. Hoy soy voluntario en cada entrega.",
    },
    context: { en: "Volunteer", es: "Voluntario" },
    image: "",
  },
];

export const defaultStories: StoryItem[] = [
  {
    id: "s1",
    sort: 1,
    published: true,
    title: { en: "A winter without cold", es: "Un invierno sin frío" },
    text: {
      en: "Last December, our clothing closet gave out more than 80 winter coats to children in our neighborhood. Local businesses donated, families sorted and sized, and volunteers delivered coats to families who could not come in person.",
      es: "El pasado diciembre, nuestro ropero entregó más de 80 abrigos de invierno a niños de nuestro vecindario. Negocios locales donaron, las familias clasificaron por tallas y los voluntarios llevaron abrigos a las familias que no podían venir en persona.",
    },
    image: "",
    date: "2025-12-20",
  },
];

export const defaultLeadership: LeaderItem[] = [
  {
    id: "pastors",
    sort: 1,
    published: true,
    name: "Our Pastors",
    role: { en: "Senior Pastors", es: "Pastores principales" },
    bio: {
      en: "Our pastors lead Casa de Milagros with a heart for worship, intercession, and the families of our city. Update this profile with their names, photo, and story from the admin dashboard.",
      es: "Nuestros pastores dirigen Casa de Milagros con un corazón por la adoración, la intercesión y las familias de nuestra ciudad. Actualiza este perfil con sus nombres, foto e historia desde el panel de administración.",
    },
    image: "",
  },
];

export const defaultMedia: MediaItem[] = [];

export const defaultCollections: { [K in keyof Collections]: Collections[K][] } = {
  events: defaultEvents,
  announcements: defaultAnnouncements,
  ministries: defaultMinistries,
  projects: defaultProjects,
  impactStats: defaultImpactStats,
  testimonials: defaultTestimonials,
  stories: defaultStories,
  leadership: defaultLeadership,
  media: defaultMedia,
};
