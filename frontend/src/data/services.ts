import type { ServiceItemData } from '../types';

export const SERVICES_DATA: ServiceItemData[] = [
  {
    id: 'service-1',
    number: '01',
    title: 'Website Development',
    shortDesc: 'Modern, responsive websites built around your business, idea, or personal brand.',
    fullDesc:
      "We create modern websites for individuals, businesses, startups, and students. Each website is designed around the project's goals, content, audience, and required functionality, with a focus on responsive design, usability, and a polished final experience.",
    tags: ['Responsive', 'Modern UI', 'Development'],
    image: '/images/web_dev_abstract_1788330230208.jpg',
    altText: 'Futuristic abstract 3D geometric composition with floating chrome spheres and neon azure trails',
  },
  {
    id: 'service-2',
    number: '02',
    title: 'UI/UX Design',
    shortDesc: 'Thoughtful interfaces designed around your users, goals, and required experience.',
    fullDesc:
      'We design UI/UX experiences that are clear, purposeful, and easy to use. From the overall visual direction to layouts, navigation, and interactions, we focus on creating an experience that matches the needs of the project.',
    tags: ['UI/UX', 'Wireframes', 'Prototyping'],
    image: '/images/ui_ux_mockup_1788330243366.jpg',
    altText: 'Minimalist editorial web layout displayed on angled floating glass screen',
  },
  {
    id: 'service-3',
    number: '03',
    title: 'Product Websites',
    shortDesc: 'Purpose-built websites that showcase products with a clear and engaging digital experience.',
    fullDesc:
      'We create dedicated product websites for launches, product showcases, campaigns, and individual products. The design and interaction are built around the product so visitors can understand it quickly and experience it in a more engaging way.',
    tags: ['Product Design', 'Landing Pages', 'Interaction'],
    image: '/images/product_showcase_1788330257619.jpg',
    altText: 'Glassmorphic UI element showing dynamic soundwaves in neon azure',
  },
  {
    id: 'service-4',
    number: '04',
    title: '3D & Interactive Websites',
    shortDesc: 'Immersive websites using 3D, motion, and interaction when the project calls for it.',
    fullDesc:
      'We build interactive and 3D websites for projects that need something beyond a conventional webpage. From animated interactions to immersive 3D experiences, we combine design and modern web technology to create memorable digital experiences.',
    tags: ['Three.js', 'WebGL', '3D'],
    image: '/images/interactive_fluid_1788330271035.jpg',
    altText: 'Glowing lines of syntax morphing into fluid metallic sculpture',
  },
];
