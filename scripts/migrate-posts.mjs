import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'

const supabase = createClient(
  'https://yoalzpghqekodmueplgs.supabase.co',
  'sb_publishable_VdoYfldD32dLH6N1bQV6MQ_ahjoFpjr'
)

const posts = [
  {
    title: 'Webflow vs WordPress: ¿cuál elegir para tu empresa en Colombia?',
    slug: 'webflow-vs-wordpress-colombia',
    excerpt: 'Comparamos rendimiento, SEO, mantenimiento y costo total de propiedad para que puedas tomar la mejor decisión para tu negocio.',
    date: '2026-03-10',
    read_time: '8 min read',
    category: 'Webflow',
    category_slug: 'webflow',
    pattern: 'dots',
    body: `Esta es una de las preguntas más frecuentes que recibimos en Webflow Colombia: **¿debo construir mi sitio en Webflow o en WordPress?** Ambas plataformas tienen millones de usuarios, pero sirven a propósitos muy distintos. En esta guía comparamos los factores más importantes para que puedas decidir con datos reales.

## Rendimiento y velocidad

Los sitios en Webflow se alojan en la CDN de AWS y Fastly de forma nativa. No necesitas configurar caché, instalar plugins de velocidad ni preocuparte por el hosting. Un sitio Webflow bien construido obtiene puntuaciones de 90+ en Google PageSpeed sin esfuerzo adicional.

WordPress, por su parte, depende enormemente del hosting que elijas y de los plugins instalados. Un sitio WordPress mal optimizado puede tardar más de 5 segundos en cargar, lo que destruye el SEO y la conversión. Con un hosting premium y configuración correcta, puede alcanzar buenos resultados, pero requiere mantenimiento constante.

## SEO técnico

Webflow genera código HTML semántico limpio por defecto. Los campos de meta titles, descriptions, Open Graph y canonical URLs se configuran visualmente sin tocar código. El sitemap XML se genera automáticamente.

WordPress ofrece más flexibilidad SEO a través de plugins como Yoast o RankMath, pero esa flexibilidad también introduce complejidad. Los errores en las configuraciones de plugins son una causa frecuente de problemas de indexación.

## Mantenimiento y seguridad

Este es el punto donde Webflow gana con mayor claridad. **No hay actualizaciones de plugins, no hay vulnerabilidades de seguridad frecuentes, no hay base de datos que hackear.** Webflow gestiona toda la infraestructura por ti.

WordPress es el CMS más hackeado del mundo, no porque sea inseguro por diseño, sino porque sus millones de plugins de terceros crean superficie de ataque. El mantenimiento preventivo (actualizaciones, backups, monitoreo) puede costar entre $100 y $500 USD al mes en servicios especializados.

## Costo total de propiedad

Cuando las empresas comparan precios, suelen cometer el error de comparar solo el costo inicial de desarrollo. El cuadro real incluye:

- **WordPress:** hosting (~$20-80/mes), plugins premium (~$50-200/año), mantenimiento (~$100-500/mes), desarrollador para cambios (~$50-150/hora).
- **Webflow:** plan CMS (~$23-39/mes), sin plugins, sin mantenimiento de infraestructura, cambios de contenido sin desarrollador.

En un horizonte de 3 años, muchos de nuestros clientes han reducido sus costos operativos entre un 40% y un 60% al migrar de WordPress a Webflow.

## ¿Cuándo elegir WordPress?

WordPress sigue siendo la mejor opción cuando necesitas funcionalidades muy específicas como e-commerce complejo con WooCommerce, membresías, o integraciones con sistemas legacy que ya tienen plugins desarrollados. También es válido si ya tienes un equipo técnico dedicado que conoce la plataforma.

## ¿Cuándo elegir Webflow?

Webflow es la elección correcta para empresas que priorizan rendimiento, diseño personalizado, SEO sólido y bajo mantenimiento. Es ideal para sitios corporativos, portafolios, landing pages de alta conversión y blogs de contenido. Si tu equipo de marketing necesita publicar y editar sin depender de un desarrollador, Webflow es claramente superior.

## Conclusión

No existe una respuesta universal. Pero para la mayoría de empresas colombianas que quieren un sitio web profesional, de alto rendimiento y bajo costo de mantenimiento, **Webflow es la elección más inteligente en 2026**. ¿Tienes dudas sobre cuál plataforma es la adecuada para tu proyecto? [Agenda una llamada](/#contacto) con nuestro equipo y te damos una recomendación honesta.`,
  },
  {
    title: 'Guía de SEO técnico para sitios Webflow en 2026',
    slug: 'seo-tecnico-webflow-guia',
    excerpt: 'Desde la estructura de URLs hasta el rendimiento de Core Web Vitals: todo lo que necesitas saber para posicionar tu sitio Webflow en Google.',
    date: '2026-03-02',
    read_time: '12 min read',
    category: 'SEO',
    category_slug: 'seo',
    pattern: 'grid',
    body: `Webflow tiene ventajas técnicas de SEO integradas que otras plataformas no ofrecen por defecto. Pero construir un sitio en Webflow no garantiza automáticamente el posicionamiento: hay configuraciones específicas que marcan la diferencia entre un sitio que aparece en la primera página y uno que nadie encuentra. Esta guía cubre los puntos críticos.

## 1. Estructura de URLs

Webflow te permite personalizar completamente los slugs de cada página y colección. Sigue estas reglas:

- URLs cortas y descriptivas: \`/servicios/desarrollo-webflow\` en lugar de \`/page?id=123\`.
- Usa guiones medios (-) para separar palabras, nunca guiones bajos (_).
- Incluye la keyword principal en la URL.
- Evita parámetros dinámicos innecesarios.

## 2. Meta titles y descriptions

Cada página en Webflow tiene campos nativos de SEO. La fórmula que usamos en nuestros proyectos:

- **Title:** Keyword principal + nombre de marca, máximo 60 caracteres.
- **Description:** Propuesta de valor clara con llamada a la acción, entre 140 y 160 caracteres.

Para colecciones CMS, configura estos campos como dinámicos para que cada ítem tenga su propio meta title único generado automáticamente.

## 3. Core Web Vitals

Google utiliza los Core Web Vitals como factor de ranking. Los tres métricas clave son:

- **LCP (Largest Contentful Paint):** tiempo hasta que el elemento más grande es visible. Objetivo: menos de 2.5 segundos.
- **INP (Interaction to Next Paint):** velocidad de respuesta a interacciones. Objetivo: menos de 200ms.
- **CLS (Cumulative Layout Shift):** estabilidad visual. Objetivo: menos de 0.1.

En Webflow, los problemas de LCP más comunes son imágenes hero sin tamaño definido y fuentes web cargando sin \`font-display: swap\`. Soluciónalos configurando dimensiones explícitas en todas las imágenes y usando la opción de font preload en Project Settings.

## 4. Datos estructurados (Schema.org)

Webflow no tiene un sistema nativo de schema, pero puedes agregar JSON-LD manualmente en el \`<head>\` de cada página o a través de un embed en el body. Los schemas más importantes para sitios de servicios son \`Organization\`, \`LocalBusiness\` y \`FAQPage\`.

## 5. Imágenes optimizadas

Webflow sirve automáticamente imágenes en WebP cuando el navegador lo soporta. Además:

- Siempre añade atributo \`alt\` descriptivo con keyword relevante.
- Usa el atributo \`loading="lazy"\` en imágenes fuera del viewport inicial.
- Mantén el peso de imágenes below the fold bajo 200KB por imagen.

## 6. Sitemap y robots.txt

Webflow genera automáticamente un sitemap XML en \`/sitemap.xml\` y un \`robots.txt\` básico. Verifica que las páginas que no deben indexarse (como páginas de prueba o staging) estén marcadas con \`noindex\` en la configuración de SEO de cada página.

## 7. Redirecciones 301

Webflow incluye un gestor nativo de redirecciones en Project Settings → SEO. Úsalo cada vez que cambies una URL para transferir el link equity acumulado. Nunca elimines una URL sin configurar su redirección correspondiente.

## Conclusión

El SEO técnico en Webflow es más accesible que en otras plataformas, pero requiere atención a los detalles. Si quieres una auditoría técnica de tu sitio actual o necesitas construir un sitio Webflow con SEO integrado desde el día uno, [contáctanos](/#contacto).`,
  },
  {
    title: 'Cómo la automatización con IA puede ahorrarle 20 horas semanales a tu equipo',
    slug: 'automatizacion-ia-negocios-colombia',
    excerpt: 'Casos reales de empresas colombianas que conectaron su sitio Webflow con herramientas de IA para automatizar cotizaciones, leads y seguimiento.',
    date: '2026-02-22',
    read_time: '6 min read',
    category: 'Automatización',
    category_slug: 'automatizacion',
    pattern: 'wave',
    body: `En 2026, la automatización ya no es exclusiva de las grandes corporaciones. Con herramientas como Make (antes Integromat), n8n, y los modelos de IA de OpenAI y Anthropic, cualquier empresa puede automatizar procesos que hoy consumen horas de trabajo manual. En este artículo mostramos casos reales de cómo lo estamos haciendo con nuestros clientes en Colombia.

## El problema: procesos manuales que escalan mal

El patrón que vemos repetidamente es el mismo: una empresa recibe consultas por su sitio web, un empleado las revisa manualmente, redacta una respuesta, agenda una llamada, envía una propuesta por correo, y hace seguimiento semanas después. Cada paso consume tiempo y depende de una persona.

Cuando el volumen de leads crece, el proceso colapsa. Los tiempos de respuesta se alargan, algunos leads se pierden, y el equipo termina atendiendo tareas operativas en lugar de cerrar ventas.

## Caso 1: Agencia de logística en Bogotá

Una empresa de logística recibía entre 40 y 60 solicitudes de cotización por semana a través de su formulario en Webflow. El proceso manual tomaba 3-4 horas diarias de su equipo comercial.

**La solución:** Conectamos su formulario Webflow con Make. Cada envío activa automáticamente: clasificación del lead por tipo de servicio con IA, generación de una cotización preliminar basada en los parámetros del formulario, envío de un correo de respuesta personalizado en menos de 2 minutos, y creación de una tarea en su CRM con toda la información del cliente.

**El resultado:** El equipo comercial ahorra 15 horas semanales y el tiempo de primera respuesta bajó de 4 horas a 2 minutos.

## Caso 2: Consultora de recursos humanos en Medellín

Una consultora de RRHH publicaba ofertas laborales en su sitio Webflow y recibía CVs por correo. Clasificarlos y responder a cada candidato tomaba 2 días por convocatoria.

**La solución:** Implementamos un flujo donde cada CV recibido es procesado por un modelo de IA que extrae la información clave, califica al candidato contra los requisitos del cargo, y envía automáticamente un correo de confirmación (o descarte) con un tono personalizado.

**El resultado:** De 2 días de clasificación manual a 30 minutos de revisión final de los candidatos preseleccionados por la IA.

## ¿Qué procesos puedes automatizar desde tu sitio Webflow?

- Respuesta automática a formularios de contacto y cotización.
- Notificaciones internas al equipo de ventas cuando llega un lead calificado.
- Seguimiento automático a prospectos que no respondieron.
- Publicación de contenido del CMS de Webflow en redes sociales.
- Generación de reportes semanales de leads y conversiones.
- Sincronización de datos entre Webflow CMS y Google Sheets o Airtable.

## Por dónde empezar

El mejor punto de entrada es identificar el proceso más repetitivo y manual de tu equipo que esté relacionado con tu sitio web. En la mayoría de los casos es la gestión de leads del formulario de contacto. Con una inversión inicial de 2-3 semanas de desarrollo, los retornos en tiempo y eficiencia son inmediatos.

Si quieres explorar cómo la automatización puede transformar tus procesos, [agenda una llamada](/#contacto) con nuestro equipo de automatización.`,
  },
  {
    title: 'CMS de Webflow: la guía completa para empresas que necesitan escalar contenido',
    slug: 'cms-webflow-empresas',
    excerpt: 'Colecciones, campos personalizados, referencias y flujos editoriales. Todo lo que tu equipo necesita para publicar sin depender de desarrolladores.',
    date: '2026-02-14',
    read_time: '9 min read',
    category: 'Webflow',
    category_slug: 'webflow',
    pattern: 'circles',
    body: `El CMS de Webflow es una de las características más poderosas de la plataforma, y también una de las más subutilizadas. Muchas empresas usan Webflow solo para páginas estáticas sin explotar la capacidad de gestionar contenido estructurado dinámicamente. Esta guía explica cómo el CMS puede transformar la forma en que tu equipo produce y publica contenido.

## ¿Qué es una Colección en Webflow?

Una Colección es el equivalente a una tabla de base de datos en el editor visual de Webflow. Puedes crear colecciones para blog posts, proyectos, testimonios, miembros del equipo, casos de estudio, FAQs, o cualquier tipo de contenido estructurado que se repita.

Cada Colección tiene **campos personalizados** que defines tú: texto, números, imágenes, archivos, fechas, opciones, referencias a otras colecciones, y más. Una vez configurada, tu equipo puede crear y editar ítems sin tocar el diseño.

## Casos de uso típicos

- **Blog:** Colección de artículos con campos para título, contenido enriquecido, imagen destacada, categoría, autor y fecha.
- **Portafolio:** Colección de proyectos con nombre del cliente, industria, servicios prestados, imágenes y resultados.
- **Equipo:** Colección de personas con nombre, cargo, foto, bio y redes sociales.
- **Precios:** Colección de planes con nombre, precio, descripción y lista de features.
- **Testimonios:** Colección con nombre del cliente, empresa, cargo, texto y puntuación.

## Referencias entre Colecciones

Una de las funciones más poderosas del CMS es la posibilidad de crear relaciones entre colecciones. Por ejemplo, cada artículo del blog puede referenciar a un ítem de la Colección "Autores", o cada proyecto puede referenciar múltiples ítems de la Colección "Servicios". Esto permite construir arquitecturas de contenido complejas sin código.

## Flujo editorial para equipos

Webflow incluye un Editor Mode que permite a miembros del equipo editar contenido directamente en el sitio publicado, sin acceder al diseñador. Esto significa que tu equipo de marketing puede:

- Crear y publicar nuevos artículos desde una interfaz simple.
- Editar textos e imágenes en cualquier página.
- Guardar borradores y programar publicaciones.
- Todo sin la posibilidad de "romper" el diseño.

## Límites del CMS a considerar

El plan CMS de Webflow permite hasta 2,000 ítems por colección. El plan Business sube a 10,000 ítems. Para sitios con cientos de miles de contenidos (como marketplaces o portales de noticias de alto volumen), Webflow puede no ser la solución ideal sin una arquitectura headless.

## CMS headless con Webflow

Webflow también ofrece una API de CMS que permite usar el contenido almacenado en Webflow desde un frontend construido con Next.js, Astro, o cualquier otro framework. Esto combina la facilidad editorial de Webflow con la flexibilidad de un frontend personalizado: lo mejor de ambos mundos para proyectos de mayor escala.

## Conclusión

El CMS de Webflow elimina la dependencia del desarrollador para el día a día del contenido. Si tu equipo todavía llama al desarrollador cada vez que quiere cambiar un texto o agregar una entrada al blog, es hora de configurar correctamente el CMS. [Contáctanos](/#contacto) y diseñamos la arquitectura de contenido ideal para tu empresa.`,
  },
  {
    title: 'Migración de WordPress a Webflow sin perder SEO ni tráfico orgánico',
    slug: 'migracion-wordpress-webflow',
    excerpt: 'El proceso completo que usamos con nuestros clientes para migrar sin caídas de posicionamiento: redirecciones, sitemaps, meta tags y más.',
    date: '2026-01-28',
    read_time: '10 min read',
    category: 'Webflow',
    category_slug: 'webflow',
    pattern: 'dots',
    body: `Migrar de WordPress a Webflow es uno de los proyectos más frecuentes que realizamos. Y también uno de los que más miedo genera en los equipos de marketing: el temor a perder el posicionamiento orgánico construido durante años es completamente válido. La buena noticia es que una migración bien ejecutada no solo preserva el SEO, sino que frecuentemente lo mejora. Aquí está el proceso que seguimos.

## Fase 1: Auditoría pre-migración

Antes de escribir una sola línea de código o crear una página en Webflow, necesitas un inventario completo de lo que tienes. Esto incluye:

- Lista completa de todas las URLs indexadas (usa Google Search Console o Screaming Frog).
- Ranking actual de keywords para cada página importante.
- Backlinks apuntando a URLs específicas (herramientas como Ahrefs o SEMrush).
- Meta titles y descriptions actuales de cada página.
- Datos estructurados (Schema) implementados.

Este inventario es tu "estado de referencia". Te permite comparar antes y después, y detectar caídas rápidamente.

## Fase 2: Mapeo de redirecciones

Si la estructura de URLs va a cambiar (lo cual es frecuente, porque WordPress suele tener URLs feas), necesitas un mapa de redirecciones 1-a-1. Formato: URL antigua → URL nueva.

Cada URL que existía en WordPress y que tenía tráfico o backlinks necesita una redirección 301 hacia su equivalente en Webflow. Sin esto, Google interpretará que ese contenido desapareció y redistribuirá el link equity.

## Fase 3: Construcción en Webflow

Durante la construcción del nuevo sitio en Webflow, prioriza:

- Replicar exactamente los meta titles y descriptions de las páginas más importantes.
- Mantener la misma estructura de headings (H1, H2, H3) en las páginas de alto tráfico.
- Preservar o mejorar el contenido textual de las páginas posicionadas.
- Implementar los mismos datos estructurados que tenías en WordPress.

## Fase 4: Configuración técnica en Webflow

Antes del lanzamiento, verifica estos puntos críticos en Webflow:

- Configurar todas las redirecciones 301 en Project Settings → SEO → Redirects.
- Configurar el dominio personalizado y forzar HTTPS.
- Verificar que el sitemap XML incluye todas las páginas correctas.
- Asegurarte de que el robots.txt no bloquea páginas importantes.
- Configurar Google Analytics 4 y Google Search Console con el nuevo dominio.

## Fase 5: Lanzamiento y monitoreo

El día del lanzamiento, no lo hagas un viernes. Hazlo un martes o miércoles para tener tiempo de reaccionar si algo sale mal. Inmediatamente después del lanzamiento:

- Solicita re-indexación de las páginas más importantes en Search Console.
- Monitorea el tráfico orgánico diariamente durante las primeras 2 semanas.
- Verifica que las redirecciones funcionan correctamente con una herramienta de rastreo.
- Comprueba que todas las URLs del sitemap devuelven código 200.

## ¿Qué esperar en los primeros meses?

Es normal que haya fluctuaciones de rankings durante las primeras 4-6 semanas mientras Google re-rastrea e indexa el nuevo sitio. Una migración bien ejecutada típicamente recupera los rankings pre-migración en 4-8 semanas, y luego los supera gracias a la mejora en velocidad y código limpio de Webflow.

En los proyectos de migración que hemos realizado, el 100% de los clientes recuperó sus rankings en menos de 8 semanas, y el 80% los superó en los 3 meses siguientes.

## Conclusión

Una migración de WordPress a Webflow es un proyecto que requiere planificación meticulosa, pero los beneficios a largo plazo en rendimiento, mantenimiento y SEO lo justifican ampliamente. Si estás considerando esta migración, [contáctanos](/#contacto) para que te expliquemos nuestro proceso de migración sin riesgo.`,
  },
]

async function migrate() {
  console.log('Starting migration of 5 blog posts to Supabase...\n')

  for (const post of posts) {
    const htmlBody = await marked(post.body)

    const { error } = await supabase.from('posts').insert({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: htmlBody,
      date: post.date,
      read_time: post.read_time,
      category: post.category,
      category_slug: post.category_slug,
      pattern: post.pattern,
      published: true,
    })

    if (error) {
      console.error(`❌ Failed: ${post.slug}`)
      console.error(error.message)
    } else {
      console.log(`✓ Inserted: ${post.slug}`)
    }
  }

  console.log('\nMigration complete.')
}

migrate()
