import logging
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.service import Service

logger = logging.getLogger("leukotex.seed")

INITIAL_PROJECTS = [
    {
        "id": "proj-1",
        "slug": "nexus-protocol",
        "title": "Nexus Protocol",
        "year": "2024",
        "category": "3D Website",
        "category_slug": "3d-websites",
        "description": "Immersive data visualization platform for high-frequency trading analytics with real-time WebGL rendering.",
        "full_description": "Nexus Protocol bridges quantitative finance with cutting-edge real-time 3D telemetry. Utilizing custom GLSL shaders and optimized WebGL pipelines, the platform processes millions of data points simultaneously while maintaining fluid 60fps interactivity.",
        "tags": ["WebGL", "Three.js", "Fintech", "Realtime"],
        "thumbnail": "https://lh3.googleusercontent.com/aida-public/AB6AXuBXQfUSHxD3ANyv_sR3pkDm-_h-RpZOpPD3AArN9nsn7tq31NJKp6Pz7V5ur1scNrIJu9yNjGYvlBkSK2UUa29eIgnqg67cQzojDARFjnnWgaUYHRYcT0TThYswPT_pZKFOiWbiONFDiUIFlxfFh9Uq4B24NQqYV_hdFyWWVgOs07V8ual-ppxaLP7XZBWaLIA2BV_-he703EMP1xb1yJw6qCjd5kJuPlhhXen56dSZo3QyoclF8jU8",
        "live_url": "https://leukotex.com/nexus",
        "client": "Nexus Global Alpha",
        "featured": True,
    },
    {
        "id": "proj-2",
        "slug": "aura-spatial",
        "title": "Aura Spatial",
        "year": "2024",
        "category": "Interactive",
        "category_slug": "interactive",
        "description": "Next-generation spatial commerce experience for luxury fashion and digital couture.",
        "full_description": "A bespoke 3D virtual showroom developed for high-end luxury fashion houses. Features procedural fabric physics, dynamic ray-marched lighting, and tactile micro-interactions that elevate e-commerce into high art.",
        "tags": ["E-Commerce", "Interactive", "GLSL", "Spatial"],
        "thumbnail": "https://lh3.googleusercontent.com/aida-public/AB6AXuD48qp-RMkU9Ag64FV81dbhXB4wFPoEpYoQx6fgPmBKqTtvFuqVwp_0218WlJKMFo-9nvbYP8E0pMgz6ksLD_JnvELWDG4UJts4RI1ecPiQyYkmrsMt6hAwLqfs1OlUjstIFF651lKsQVJbnbzSR774x2FhqG_-HTA9QzgfDcYpvlgPO3Cz261Bn7i3yFZEzBR6XOBohPlwt-9X_3ola53lLZ3RPSKwg_9YaHJX9ElKTJhp5WG8RF3G",
        "live_url": "https://leukotex.com/aura",
        "client": "Maison Aura Paris",
        "featured": True,
    },
    {
        "id": "proj-3",
        "slug": "hyperion-core",
        "title": "Project 01 // Hyperion",
        "year": "2024",
        "category": "3D Website",
        "category_slug": "3d-websites",
        "description": "Moody, cinematic 3D abstract visualization of a digital landscape in deep blues and obsidian tones.",
        "full_description": "An interactive audio-visual voyage exploring synthetic topography and volumetric nebulae. Powered by custom WebGL post-processing passes and reactive audio-spectrum analysis.",
        "tags": ["3D Website", "Creative Direction", "Audio-Visual", "Shader"],
        "thumbnail": "https://lh3.googleusercontent.com/aida-public/AB6AXuAhxHxHmez8rKxXGAbZJ_SPN1OP9-dQIW5-939Zump87f11Xi1b5_S5e3GwHoImhbUoSZNRMNzJauNwB_31RVdf6jVAtK4KufbTSMY9fC7uX5qVHVo9NReImaF1BqvUUveyqP1gNj1q9ZfkcBLHq0jNCJH7xb3YL4mzUL2SKWIeQXiEWtubCSk3wVMiUcRbu3kKk0q7joSkZs7cqBTl6Cx_DHt-ouYwq5-b5qFzaDFVa4RNzvCykmWT",
        "live_url": "https://leukotex.com/hyperion",
        "client": "Hyperion Labs",
        "featured": False,
    },
    {
        "id": "proj-4",
        "slug": "chronos-monolith",
        "title": "Project 02 // Chronos",
        "year": "2023",
        "category": "Portfolio",
        "category_slug": "portfolio",
        "description": "High-contrast monochromatic product gallery of futuristic industrial design objects.",
        "full_description": "An editorial exhibition platform crafted for an elite Swiss horology atelier. Seamlessly merges sharp brutalist typography with smooth interactive scroll-tied 3D mesh slicing.",
        "tags": ["Interactive", "WebGL", "Editorial", "Minimalism"],
        "thumbnail": "https://lh3.googleusercontent.com/aida-public/AB6AXuA0HFCsNeFFFxJ14gUZK__BZLBtUqcjLz6SZIOBOWKufYHOc0GPSEmuvOc5vz2AAIzU4Xbi4wSQKgx6rTF11n8qgG8OZskDs0a3lVnzHqNmxSz5TYGFb83xsKWZNH-jZsyWP9qlirRoTHMeFkGkOYE3IvE2Odd86ieUy0Rmv-iUaSlGIEHRFUydb-gaKOowDyQCmxU04fbT6ma7dJ39AW5P-iA9qLLOClJAqJuzCTEtErlTJC7TkND7",
        "live_url": "https://leukotex.com/chronos",
        "client": "Chronos Atelier Zurich",
        "featured": False,
    },
]

INITIAL_SERVICES = [
    {
        "id": "serv-1",
        "number": "01",
        "title": "3D Web Experiences",
        "short_desc": "WebGL and Three.js environments that break the boundaries of 2D space.",
        "full_desc": "Immersive digital environments that break the boundaries of the viewport. We leverage WebGL, Three.js, and custom GLSL shaders to construct spatial narratives that captivate and convert.",
        "tags": ["WebGL", "Three.js", "GLSL Shaders"],
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDnFkOfAAGZZPAx_e5A1akvMGv1Yq5bRylzjWJJvhJic4x287OWQvKPtL7hXQGdyqSnPtwSO5PjHwcKTdqZ0o53xIla3KW6u8rMeoKrRMFz4vyWxR6wY7L52H8ec55o1g3JjqvCVsca2KIzI33tsInZBL_M2UzH_LRQnX1Hi60rBb5O3CotJ4hQwPb15O02NLu7bvWJdsp4RaPvzeK1BfmBTjTC1BxQhN-yafXVbaWeSMJthF1U7nUJ",
        "alt_text": "Futuristic abstract 3D geometric composition with floating chrome spheres",
    },
    {
        "id": "serv-2",
        "number": "02",
        "title": "Portfolio Websites",
        "short_desc": "High-end editorial layouts designed for creative visionaries.",
        "full_desc": "Digital galleries crafted for visionaries. We design bespoke portfolios that frame your work as high art, utilizing negative space and cinematic typography to let your creations speak.",
        "tags": ["Art Direction", "Typography", "Motion"],
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCIqXCHgozW7E-OaPDUZzM1VDwjb7RGpFt-psff3jEhn_ZDel-lBmOy4xjN-5Wjk53s8E5tO9ifK3LhJeW9zScFScsiSIHJD3kmP1RIuWzMN1UP4oakADZYkS3rQA705mAdN47Om7w6Ix8Gvc_GlBzV4GlEev0GauAMiDqeDe4BV_Vw70ML8R8mTLvColDIK_zZXweOnBIWwZx3UY1L2PpoobxyHTkfSR9O4v1XGbTak-Y4jf8b5tFk",
        "alt_text": "Minimalist editorial web layout displayed on angled floating glass screen",
    },
    {
        "id": "serv-3",
        "number": "03",
        "title": "Interactive Web Design",
        "short_desc": "Interfaces that feel alive with organic response to user intent.",
        "full_desc": "Interfaces that feel alive. Through deliberate micro-interactions and seamless page transitions, we create platforms that respond organically to user intent, transforming passive viewing into active exploration.",
        "tags": ["UX/UI", "Micro-interactions", "Prototyping"],
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCczlckiZLemIaUTnU3L2SXHsSRfnXHF0O-N1OMFtuMXzvYy9GNT1vzU9k3F-Fgx6st9ZNlI5LpH41IvUpZ0lt0dmfa5GNprV5UWuBemlTfTHcFnhPucnjAQzNIvZq62xf0eUOTK9_TStlaXmsnvTpa4QUKXdGf-_SB4Y3VM3hFiG34jjY1_nbM9IsdXk4eIelBPNCkgUInF1_wr02smH5usiYiAM6NU7Qt6x_dw7E5_n1AY-b3kMwI",
        "alt_text": "Glassmorphic UI element showing dynamic soundwaves in neon azure",
    },
    {
        "id": "serv-4",
        "number": "04",
        "title": "Creative Development",
        "short_desc": "Bespoke animations, interactions, and performant frontend architecture.",
        "full_desc": "Bridging the gap between ambitious design and flawless execution. We write clean, performant code that brings complex creative visions to life without compromising on speed or accessibility.",
        "tags": ["Frontend Architecture", "Performance", "Animation Logic"],
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBxrUwHQ7n1JBuL9-J1vNTcMZRXT7MCBOvYcX_MsCjQ9E-h1zg5LERQ_0-aY0lF9ZlFumdYdOfxMxjKBIpVZ60acBCEs7854ZpZaKwAVpk2toKY0k7qwgs585JoH9NwOadogxu3B8hhPJKpY4bRI-XYylOu1ZIfV2spR6_ncZoo2NWeoftefB6zdtBtcRRlqhrene080JL0V5dEP8hRN7u1eTOPpRTCeXnYm1ybh-AuFiu1RogFSc8R",
        "alt_text": "Glowing lines of syntax morphing into fluid metallic sculpture",
    },
]


def seed_database(db: Session):
    """Seed initial showcase projects and studio services if tables are empty. Admin accounts are managed separately."""
    # 1. Case Study Projects
    project_count = db.query(Project).count()
    if project_count == 0:
        logger.info("Seeding initial case study projects...")
        for p in INITIAL_PROJECTS:
            project = Project(**p)
            db.add(project)
        db.commit()

    # 2. Studio Services
    service_count = db.query(Service).count()
    if service_count == 0:
        logger.info("Seeding initial studio services...")
        for s in INITIAL_SERVICES:
            service = Service(**s)
            db.add(service)
        db.commit()

    logger.info("Database showcase data seeding complete.")
