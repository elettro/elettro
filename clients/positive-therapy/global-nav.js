(() => {
  'use strict';

  const STORAGE_KEY = 'positiveTherapyLanguage';
  const supportedLanguages = ['en', 'es', 'fr'];
  const path = window.location.pathname.toLowerCase();
  const page = path.includes('/simple-practice/') ? 'simple' : 'audit';

  const navigationCopy = {
    en: { audit: 'Audit', simple: 'SimplePractice', language: 'Language' },
    es: { audit: 'Auditoría', simple: 'SimplePractice', language: 'Idioma' },
    fr: { audit: 'Audit', simple: 'SimplePractice', language: 'Langue' }
  };

  const selectors = page === 'simple' ? [
    '.eyebrow',
    '.head h1',
    '.sub',
    '.gateway-text',
    '.cap-body h3',
    '.cap-body p',
    '.foot-note'
  ] : [
    '.brand-tag',
    '.report-meta',
    'header .lede',
    '.ring-label',
    '.ring-sub',
    '.section-eyebrow',
    '.section h2',
    '.section-intro',
    '.bar-label',
    '.bar-tag',
    '.spotlight-eyebrow',
    '.spotlight h3',
    '.spotlight > p',
    '.page-chip',
    '.quote-line',
    '.finding-severity',
    '.finding h3',
    '.finding p',
    '.qa-item .q',
    '.qa-item .why',
    '.plan-card .tag',
    '.plan-card h4',
    '.plan-card p',
    '.plan-card li',
    '.tech-card .label',
    '.tech-card .val',
    '.rec-body h4',
    '.rec-body p',
    '.method-box p',
    'footer .cta',
    'footer .fine'
  ];

  const translations = {
    simple: {
      es: {
        title: 'Portal del paciente | Lo que pueden hacer los pacientes',
        groups: {
          '.eyebrow': ['Portal del paciente'],
          '.head h1': ['Todo lo que los pacientes necesitan,<br><span class="accent">en un solo lugar.</span>'],
          '.sub': ['Un inicio de sesión seguro brinda a los pacientes actuales acceso directo a su atención desde el propio sitio.'],
          '.gateway-text': ['Inicio de sesión al portal del paciente<span>Acceso con un clic desde la navegación principal del sitio</span>'],
          '.cap-body h3': [
            'Programar citas',
            'Realizar pagos',
            'Completar formularios de admisión',
            'Mensajería segura',
            'Ver documentos y notas',
            'Unirse a visitas de telesalud',
            'Recordatorios de citas',
            'Administrar su perfil'
          ],
          '.cap-body p': [
            'Solicite o reserve sesiones en línea en cualquier momento, sin llamadas de ida y vuelta.',
            'Pague sus facturas de forma segura en línea. Se aceptan tarjetas, HSA y FSA.',
            'Complete documentos y formularios de consentimiento a su propio ritmo antes de la primera visita.',
            'Envíe mensajes directamente a la práctica con privacidad y cifrado completos.',
            'Acceda a archivos compartidos, registros y documentos cuando los necesite.',
            'Inicie una sesión de video directamente, sin buscar un enlace separado.',
            'Los recordatorios automáticos por correo electrónico y texto reducen las ausencias.',
            'Actualice la información de contacto, las preferencias y los datos de la cuenta en cualquier momento.'
          ],
          '.foot-note': ['Con tecnología de SimplePractice &middot; acceso directo desde positivetherapyfl.com']
        }
      },
      fr: {
        title: 'Portail patient | Ce que les patients peuvent faire',
        groups: {
          '.eyebrow': ['Portail patient'],
          '.head h1': ['Tout ce dont les patients ont besoin,<br><span class="accent">au même endroit.</span>'],
          '.sub': ['Une connexion sécurisée donne aux patients actuels un accès direct à leurs soins depuis le site.'],
          '.gateway-text': ['Connexion au portail patient<span>Un clic depuis la navigation principale du site</span>'],
          '.cap-body h3': [
            'Planifier des rendez-vous',
            'Effectuer des paiements',
            'Remplir les formulaires d’admission',
            'Messagerie sécurisée',
            'Consulter les documents et notes',
            'Participer aux séances de télésanté',
            'Rappels de rendez-vous',
            'Gérer leur profil'
          ],
          '.cap-body p': [
            'Demandez ou réservez des séances en ligne à tout moment, sans échanges téléphoniques inutiles.',
            'Réglez vos factures en ligne en toute sécurité. Les cartes, HSA et FSA sont acceptées.',
            'Remplissez les documents et formulaires de consentement à votre rythme avant la première visite.',
            'Échangez directement avec le cabinet dans un environnement entièrement privé et chiffré.',
            'Accédez aux fichiers partagés, dossiers et documents dès que nécessaire.',
            'Lancez directement une séance vidéo sans rechercher un lien séparé.',
            'Des rappels automatiques par e-mail et SMS réduisent les rendez-vous manqués.',
            'Mettez à jour les coordonnées, préférences et informations du compte à tout moment.'
          ],
          '.foot-note': ['Propulsé par SimplePractice &middot; accessible directement depuis positivetherapyfl.com']
        }
      }
    },
    audit: {
      es: {
        title: 'Auditoría Elettro | Positive Therapy FL',
        groups: {
          '.brand-tag': ['Auditoría SEO y AIO del sitio'],
          '.report-meta': ['Preparado el 23 de julio de 2026<br>Inspección del sitio en vivo y puntuación orientativa<br>Elettro, Inc. &middot; elettro.com'],
          'header .lede': ['Una evaluación orientativa de la salud de la búsqueda orgánica y la preparación para motores de respuesta con IA, con especial atención a las nueve páginas de ubicación de “área de servicio”, que en su forma actual perjudican más de lo que ayudan.'],
          '.ring-label': ['Puntuación SEO actual', 'Proyección tras la reconstrucción de Elettro'],
          '.ring-sub': [
            'Una base técnica sólida, debilitada por contenido de página basado en plantillas y la falta de datos estructurados confirmados.',
            'Una estrategia de ubicaciones consolidada, implementación completa de schema y contenido original cierran casi toda la brecha.'
          ],
          '.section-eyebrow': [
            'Desglose por categoría',
            'Hallazgo prioritario',
            'Hallazgos adicionales',
            'Hallazgos de UX y conversión',
            'Preguntas de descubrimiento',
            'Plan de producción creativa',
            'Resumen técnico',
            'Recomendaciones de Elettro',
            'Metodología'
          ],
          '.section h2': [
            'De dónde proviene la puntuación',
            'Las páginas de ubicación representan un riesgo de spam, no una estrategia SEO',
            'Qué más está frenando la puntuación',
            'Puntos de fricción que trabajan contra los objetivos del sitio',
            'Qué confirmar con la clienta antes de definir el alcance',
            'Qué construiría Elettro',
            'Tecnología y plataforma',
            'Ruta de 62/48 a 91/88',
            'Cómo se calculó esta puntuación'
          ],
          '.section-intro': [
            'Actual frente a proyectado, por categoría. Las señales locales y de entidad representan la mayor brecha del sitio y están directamente vinculadas al patrón de páginas de ubicación descrito a continuación.',
            'Además del SEO/AIO, estos son problemas de usabilidad y conversión observados durante la revisión. Cada uno dificulta la función principal del sitio: lograr que una persona reserve una cita.',
            'Temas pendientes para la próxima conversación. Las respuestas definirán tanto el alcance de la propuesta como la arquitectura de información de la reconstrucción.',
            'Además de la reconstrucción técnica y estructural, el proyecto incluye una fase de producción creativa para darle al sitio identidad visual y dinamismo.'
          ],
          '.bar-label': ['SEO técnico', 'Contenido en página', 'Señales locales y de entidad', 'Datos estructurados', 'Preparación AIO / motores de respuesta'],
          '.bar-tag': ['Actual', 'Proyectado', 'Actual', 'Proyectado', 'Actual', 'Proyectado', 'Actual', 'Proyectado', 'Actual', 'Proyectado'],
          '.spotlight-eyebrow': ['Crítico — Patrón de páginas puerta'],
          '.spotlight h3': ['Nueve páginas de “área de servicio”, una sola plantilla'],
          '.spotlight > p': [
            'Positive Therapy FL mantiene páginas específicas para Davie, Fort Lauderdale, Fisher Island, Palm Beach, Pinecrest, Palmetto Bay, Kendall y una página general para Florida, aunque se trata de una <strong>práctica de telesalud con una única dirección física en Southwest Ranches</strong>. La inspección directa de las páginas de Palm Beach y Fisher Island muestra la misma estructura, el mismo esquema de encabezados H2 (Por qué elegirnos &rarr; Cómo funciona &rarr; Beneficios principales &rarr; Para quién es ideal &rarr; Historias de éxito &rarr; Preguntas frecuentes) y los mismos cuatro textos de servicios al final de cada página, cambiando únicamente el nombre de la ciudad.',
            'Esto coincide casi exactamente con la definición de Google de páginas puerta: <strong>varias páginas dirigidas a una ciudad o región específica que conducen al usuario a un mismo destino sin contenido realmente único entre ellas.</strong> Los sitios que utilizan este patrón a escala pueden sufrir una reducción en la visibilidad de esas páginas o en las clasificaciones locales generales del dominio.',
            'Fisher Island es una isla privada y cerrada de aproximadamente 800 residentes. Presentarla como un “área de servicio” independiente para una práctica de terapia en línea ubicada a más de 40 millas en Southwest Ranches parece una apropiación de palabras clave geográficas, no una señal de relevancia local auténtica. Es el ejemplo más evidente del conjunto.'
          ],
          '.page-chip': [
            '<b>Página de Palm Beach</b>Los mismos 4 textos de servicios, el mismo formato de testimonios y el mismo texto de llamada a la acción',
            '<b>Página de Fisher Island</b>Estructura idéntica, incluso coincide la cantidad de preguntas frecuentes y el patrón de redacción',
            '<b>Ambas páginas</b>Una sola dirección compartida en el pie de página, sin una señal diferenciada de presencia local'
          ],
          '.quote-line': ['Palm Beach: “Terapia individual en Palm Beach... un espacio seguro y confidencial...”<br>Fisher Island: “Terapia individual en Fisher Island... un espacio seguro y confidencial...”'],
          '.finding-severity': ['Crítico', 'Crítico', 'Moderado', 'Moderado', 'Moderado', 'Moderado', 'Moderado', 'Moderado', 'Moderado', 'Moderado'],
          '.finding h3': [
            'No hay datos estructurados confirmados',
            'No existe llms.txt',
            'Metatítulos formulistas',
            'No hay señales locales de confianza verificables',
            'Exceso de etiquetas, más de 30 por artículo',
            'La captación de nuevas reseñas evita el Perfil de Empresa de Google',
            'La ventana emergente interrumpe antes de mostrar contenido',
            'Patrón anticuado de animar todo al desplazarse',
            'La imagen principal no centra al sujeto real',
            'La ruta principal de la página de inicio conduce a una suscripción'
          ],
          '.finding p': [
            'No se detectó schema LocalBusiness, MedicalOrganization ni FAQPage en el marcado renderizado. Para un servicio local relacionado con salud, esto desaprovecha los resultados enriquecidos y supone una desventaja directa para AIO. Los motores de respuesta dependen en gran medida de datos estructurados de entidad para decidir qué fuentes citar.',
            'No existe un archivo llms.txt. A medida que crece el descubrimiento impulsado por IA, este archivo se está convirtiendo en una señal habitual para ayudar a los motores de respuesta a comprender la estructura del sitio y sus páginas autorizadas.',
            'El patrón de título “[Servicio] en [Ciudad] | Reserve ahora” se repite en todas las páginas. Funciona para indexación, pero ofrece poca diferenciación en los resultados de búsqueda y una señal de entidad débil para resúmenes de IA.',
            'Los testimonios se atribuyen solo con iniciales, como “S.M., cliente de Palm Beach”, y no enlazan a una fuente verificable de reseñas como Google o Healthgrades. Se pierde una oportunidad de aumentar la confianza y la capacidad de citación en AIO.',
            'Cada artículo del blog contiene más de 30 etiquetas superpuestas como “relationship-support”, “relationship-success”, “relationship-satisfaction” y “relationship-growth”, conceptos casi equivalentes. Cada etiqueta probablemente genera una página de archivo delgada con un solo artículo, lo que infla el índice y diluye la autoridad temática.',
            'La página de reseñas sincroniza y muestra correctamente las reseñas existentes de Google, pero el formulario “dejar una reseña” envía la opinión solo al sitio. Las nuevas reseñas no llegan a Google, no contribuyen a la clasificación local y no aparecen donde las personas comparan proveedores.',
            'Una ventana emergente aparece al cargar la página antes de que el visitante vea contenido. Para una práctica terapéutica, la primera impresión es especialmente importante. Una interrupción inmediata trabaja contra el tono de confianza que el resto del sitio intenta crear.',
            'La animación generalizada de aparición y desplazamiento en casi todos los elementos parece una convención de plantilla antigua. Los sitios modernos usan el movimiento de forma selectiva. Debe apoyar el contenido, no llamar la atención sobre sí mismo.',
            'En la página de consulta sobre autismo, la composición de la imagen principal centra por completo a los dos adultos, mientras el niño, sujeto real del servicio, queda relegado, mirando hacia abajo y recortado al fondo. En una página centrada en la infancia, la imagen debe centrar al niño.',
            'El flujo principal de la página de inicio dirige al visitante hacia “Suscribirse” en lugar de la ruta de reserva. Para un negocio de servicios, la llamada a la acción principal debe conducir de la forma más directa posible a una acción que genere clientes potenciales.'
          ],
          '.qa-item .q': [
            '<span class="tag-q">P —</span> ¿El formulario “Reservar una cita” genera conversiones reales?',
            '<span class="tag-q">P —</span> ¿Tienen una tienda Shopify activa?',
            '<span class="tag-q">P —</span> ¿Hay nuevos servicios o actualizaciones de contenido para la reconstrucción?',
            '<span class="tag-q">P —</span> ¿Utiliza actualmente una plataforma de gestión de pacientes o historial clínico electrónico?'
          ],
          '.qa-item .why': [
            '¿Reciben solicitudes reales o principalmente spam? Esto determina si la reconstrucción debe mantener el formulario actual, añadir protección contra spam como reCAPTCHA o un honeypot, o migrar por completo a una herramienta de programación tipo Calendly.',
            'Si no tienen una y están abiertos a la idea, podrían aprovechar la configuración de la tienda Stashbox.ai de Dean y añadir allí su colección de productos o merchandising en lugar de crear otra tienda independiente.',
            'Confirmar si hay nuevos servicios que añadir o si la reconstrucción debe conservar el contenido y los servicios actuales. Esto afecta el alcance y el calendario de redacción.',
            'En caso afirmativo, ¿cuál utiliza, por ejemplo SimplePractice, TherapyNotes, Kareo o athenahealth? Conviene investigar si ofrece una API o un portal integrable para que los pacientes inicien sesión directamente en positivetherapyfl.com, completen formularios, paguen o consulten archivos, en lugar de usar un portal separado. La viabilidad depende de la plataforma y debe confirmarse antes de definir el alcance.'
          ],
          '.plan-card .tag': ['Activos de marca', 'Movimiento', 'Visualización'],
          '.plan-card h4': ['Conjunto de imágenes de marca con el logotipo integrado', 'Clips de video generados con IA', 'Infografías personalizadas'],
          '.plan-card p': [
            'Tomar el logotipo existente y producir un conjunto completo de imágenes de marca en distintos formatos:',
            'Clips breves producidos con IA para aportar movimiento sutil a páginas clave, reemplazando el enfoque estático y anticuado de animaciones al desplazarse con contenido audiovisual real.',
            'Infografías originales para visualizar temas clave del sitio y ofrecer a los visitantes una forma clara, escaneable y compartible de comprender conceptos que hoy solo aparecen en textos extensos.'
          ],
          '.plan-card li': ['Vertical, formato social o historia', 'Cuadrado, formato de feed o perfil', 'Horizontal, formato de cabecera o banner web'],
          '.tech-card .label': ['Plataforma', 'Indexabilidad', 'Vista móvil', 'Datos estructurados'],
          '.tech-card .val': ['CMS Webware.ai', 'index, follow', 'Configurada', 'No confirmados'],
          '.rec-body h4': [
            'Consolidar nueve páginas puerta en 2 o 3 centros regionales reales',
            'Implementar schema LocalBusiness y FAQPage',
            'Añadir llms.txt y una autoría coherente de entidad',
            'Reemplazar testimonios con iniciales por reseñas enlazables',
            'Reescribir el contenido para eliminar plantillas y mejorar su capacidad de citación',
            'Eliminar la ventana emergente inicial y el patrón anticuado de animación al desplazarse',
            'Redirigir la ruta principal de la página de inicio hacia la reserva, no el boletín',
            'Automatizar la sincronización de reseñas de Google y redirigir la captación de nuevas reseñas',
            'Consolidar las etiquetas del blog en 5 a 8 categorías reutilizables'
          ],
          '.rec-body p': [
            'Sustituir la plantilla ciudad por ciudad por páginas de condado realmente diferenciadas, por ejemplo Broward, Palm Beach y Miami-Dade, construidas con contenido distintivo como redes de seguros, disponibilidad regional de terapeutas y alianzas locales, no nombres de ciudades intercambiados.',
            'Añadir datos estructurados JSON-LD en todo el sitio, incluido el marcado serviceArea, para reflejar correctamente el modelo de telesalud sin sugerir nueve oficinas locales distintas.',
            'Publicar un archivo llms.txt y mantener coherentes los nombres y credenciales de los profesionales en todas las páginas para que los motores de respuesta identifiquen la práctica como una sola entidad confiable.',
            'Mostrar reseñas verificadas de Google o Healthgrades con atribución real cuando exista consentimiento. Esto mejora la confianza del usuario y la capacidad de citación por motores de IA.',
            'Sustituir las secciones repetidas por contenido original y específico para cada página, con credenciales concretas, modalidades ofrecidas y contexto regional real que las personas y los motores generativos puedan considerar confiable.',
            'Eliminar la interrupción al cargar la página y el efecto generalizado de “animar todo” a favor de una primera impresión más limpia, reservando el movimiento para el nuevo contenido de video con IA.',
            'Reestructurar el flujo principal de la página de inicio para llevar directamente a la reserva o solicitud de cita, dejando la suscripción como opción secundaria y no intrusiva.',
            'Mantener la importación dinámica de reseñas de Google para mostrarlas en el sitio y dirigir la llamada a “dejar una reseña” al enlace real de escritura de reseñas de Google, no a un formulario interno.',
            'Reemplazar las más de 30 etiquetas superpuestas por un conjunto pequeño y estable de etiquetas reutilizadas en todos los artículos. Esto crea profundidad temática en lugar de fragmentarla en decenas de archivos delgados.'
          ],
          '.method-box p': [
            'Las puntuaciones son estimaciones orientativas basadas en una inspección del sitio en vivo, incluido HTML renderizado, metadatos, contenido e interconexión interna. No constituyen un diagnóstico verificado de un rastreador. Esta auditoría no tiene acceso programático al contenido renderizado por JavaScript ni a datos estructurados incrustados en etiquetas script. La presencia o ausencia de schema JSON-LD debe confirmarse manualmente con la Prueba de resultados enriquecidos de Google o mediante “Ver código fuente”.',
            'Las puntuaciones proyectadas representan la estimación de Elettro tras una reconstrucción completa que resuelva los hallazgos anteriores, basándose en proyectos comparables. No garantizan posiciones específicas en buscadores.'
          ],
          'footer .cta': ['Hablemos de la reconstrucción'],
          'footer .fine': ['Elettro, Inc. &middot; elettro.com &middot; Preparado para uso interno de presentación']
        }
      },
      fr: {
        title: 'Audit Elettro | Positive Therapy FL',
        groups: {
          '.brand-tag': ['Audit SEO et AIO du site'],
          '.report-meta': ['Préparé le 23 juillet 2026<br>Inspection du site en direct et notation indicative<br>Elettro, Inc. &middot; elettro.com'],
          'header .lede': ['Une évaluation indicative de la santé du référencement naturel et de la préparation aux moteurs de réponse IA, avec un focus sur les neuf pages de localisation « zone de service », qui nuisent actuellement davantage au site qu’elles ne l’aident.'],
          '.ring-label': ['Score SEO actuel', 'Projection après refonte par Elettro'],
          '.ring-sub': [
            'Une base technique solide, affaiblie par un contenu de page standardisé et l’absence de données structurées confirmées.',
            'Une stratégie de localisation consolidée, une mise en œuvre complète du schema et un contenu original comblent presque tout l’écart.'
          ],
          '.section-eyebrow': [
            'Répartition par catégorie',
            'Constat prioritaire',
            'Constats supplémentaires',
            'Constats UX et conversion',
            'Questions de cadrage',
            'Plan de production créative',
            'Aperçu technique',
            'Recommandations Elettro',
            'Méthodologie'
          ],
          '.section h2': [
            'Origine du score',
            'Les pages de localisation présentent un risque de spam, pas une stratégie SEO',
            'Les autres facteurs qui freinent le score',
            'Des points de friction contraires aux objectifs du site',
            'Points à confirmer avec la cliente avant de définir le périmètre',
            'Ce qu’Elettro construirait',
            'Technologies et plateforme',
            'Chemin de 62/48 à 91/88',
            'Méthode de calcul du score'
          ],
          '.section-intro': [
            'Résultats actuels et projetés par catégorie. Les signaux locaux et d’entité représentent l’écart le plus important du site et sont directement liés au modèle de pages de localisation présenté ci-dessous.',
            'Indépendamment du SEO/AIO, voici les problèmes d’utilisabilité et de conversion observés pendant l’analyse. Chacun compromet la fonction principale du site : obtenir une prise de rendez-vous.',
            'Points à traiter lors du prochain échange. Les réponses détermineront le périmètre de la proposition et l’architecture de l’information de la refonte.',
            'Au-delà de la refonte technique et structurelle, la mission comprend une phase de production créative destinée à donner au site une identité visuelle et du dynamisme.'
          ],
          '.bar-label': ['SEO technique', 'Contenu des pages', 'Signaux locaux et d’entité', 'Données structurées', 'Préparation AIO / moteurs de réponse'],
          '.bar-tag': ['Actuel', 'Projeté', 'Actuel', 'Projeté', 'Actuel', 'Projeté', 'Actuel', 'Projeté', 'Actuel', 'Projeté'],
          '.spotlight-eyebrow': ['Critique — Modèle de pages satellites'],
          '.spotlight h3': ['Neuf pages « zone de service », un seul modèle'],
          '.spotlight > p': [
            'Positive Therapy FL exploite des pages dédiées à Davie, Fort Lauderdale, Fisher Island, Palm Beach, Pinecrest, Palmetto Bay, Kendall ainsi qu’une page générale pour la Floride, alors qu’il s’agit d’un <strong>cabinet de télésanté disposant d’une seule adresse physique à Southwest Ranches</strong>. L’inspection directe des pages Palm Beach et Fisher Island révèle une structure identique, le même plan de titres H2 (Pourquoi nous choisir &rarr; Fonctionnement &rarr; Principaux avantages &rarr; Pour qui ce service est idéal &rarr; Témoignages de réussite &rarr; FAQ) et les quatre mêmes descriptions de services en bas de chaque page, seul le nom de la ville changeant.',
            'Cela correspond presque exactement à la définition de Google des pages satellites : <strong>plusieurs pages ciblant chacune une ville ou une région précise et dirigeant l’utilisateur vers une même destination sans contenu réellement unique entre elles.</strong> Les sites qui utilisent ce modèle à grande échelle peuvent voir la visibilité des pages concernées, ou les classements locaux globaux du domaine, diminuer.',
            'Fisher Island est une île privée et sécurisée d’environ 800 habitants. La présenter comme une « zone de service » distincte pour un cabinet de thérapie en ligne situé à plus de 40 miles à Southwest Ranches ressemble davantage à une captation de mots-clés géographiques qu’à une véritable pertinence locale. C’est l’exemple le plus révélateur de l’ensemble.'
          ],
          '.page-chip': [
            '<b>Page Palm Beach</b>Mêmes 4 descriptions de services, même format de témoignages et même texte d’appel à l’action',
            '<b>Page Fisher Island</b>Structure identique, y compris le nombre de FAQ et le modèle de formulation',
            '<b>Les deux pages</b>Une seule adresse partagée dans le pied de page, sans signal de présence locale distincte'
          ],
          '.quote-line': ['Palm Beach : « Thérapie individuelle à Palm Beach... un espace sûr et confidentiel... »<br>Fisher Island : « Thérapie individuelle à Fisher Island... un espace sûr et confidentiel... »'],
          '.finding-severity': ['Critique', 'Critique', 'Modéré', 'Modéré', 'Modéré', 'Modéré', 'Modéré', 'Modéré', 'Modéré', 'Modéré'],
          '.finding h3': [
            'Aucune donnée structurée confirmée',
            'Aucun fichier llms.txt',
            'Titres meta formulaires',
            'Aucun signal local de confiance vérifiable',
            'Prolifération des étiquettes, plus de 30 par article',
            'La collecte de nouveaux avis contourne la fiche d’établissement Google',
            'La fenêtre contextuelle interrompt avant l’affichage du contenu',
            'Modèle daté d’animation systématique au défilement',
            'L’image principale ne centre pas le véritable sujet',
            'Le parcours principal de l’accueil mène à une inscription à la newsletter'
          ],
          '.finding p': [
            'Aucun schema LocalBusiness, MedicalOrganization ou FAQPage n’a été détecté dans le balisage rendu. Pour un service local lié à la santé, il s’agit d’une occasion manquée pour les résultats enrichis et d’un handicap direct pour l’AIO. Les moteurs de réponse s’appuient fortement sur les données structurées d’entité pour décider quelles sources citer.',
            'Aucun fichier llms.txt n’est présent. À mesure que la découverte assistée par IA progresse, ce fichier devient un signal courant pour aider les moteurs de réponse à comprendre la structure du site et ses pages faisant autorité.',
            'Le modèle de titre « [Service] à [Ville] | Réserver » se répète sur toutes les pages. Il reste fonctionnel pour l’indexation, mais offre peu de différenciation dans les résultats de recherche et un signal d’entité faible pour les résumés IA.',
            'Les témoignages sont attribués uniquement par des initiales, par exemple « S.M., cliente de Palm Beach », sans lien vers une source vérifiable comme Google ou Healthgrades. Le site perd une occasion de renforcer la confiance et sa valeur comme source pour l’AIO.',
            'Chaque article de blog comporte plus de 30 étiquettes qui se chevauchent, comme « relationship-support », « relationship-success », « relationship-satisfaction » et « relationship-growth », des notions presque identiques. Chaque étiquette génère vraisemblablement une page d’archive pauvre contenant un seul article, ce qui gonfle l’index et dilue l’autorité thématique.',
            'La page des avis synchronise et affiche correctement les avis Google existants, mais le formulaire « laisser un avis » envoie la réponse uniquement au site. Les nouveaux avis n’atteignent donc pas Google, ne contribuent pas au classement local et n’apparaissent pas là où les prospects comparent les prestataires.',
            'Une fenêtre contextuelle apparaît dès le chargement, avant que le visiteur ait vu le moindre contenu. Pour un cabinet de thérapie, la première impression compte particulièrement. Cette interruption immédiate s’oppose au climat de confiance recherché par le reste du site.',
            'Les animations généralisées d’apparition et de glissement sur presque tous les éléments rappellent une ancienne convention de modèle. Les sites modernes utilisent le mouvement de façon sélective. Il doit soutenir le contenu, pas attirer l’attention sur lui-même.',
            'Sur la page de consultation sur l’autisme, la composition de l’image principale met entièrement l’accent sur les deux adultes, tandis que l’enfant, véritable sujet du service, reste relégué, regard baissé et recadré à l’arrière-plan. Pour une page consacrée à un service centré sur l’enfant, l’image doit placer l’enfant au centre.',
            'Le parcours principal de la page d’accueil dirige les visiteurs vers une action « S’abonner » au lieu de la prise de rendez-vous. Pour une entreprise de services, l’appel à l’action principal doit conduire aussi directement que possible à une action génératrice de prospects.'
          ],
          '.qa-item .q': [
            '<span class="tag-q">Q —</span> Le formulaire « Prendre rendez-vous » génère-t-il réellement des conversions ?',
            '<span class="tag-q">Q —</span> Disposent-ils d’une véritable boutique Shopify ?',
            '<span class="tag-q">Q —</span> Y a-t-il de nouveaux services ou des mises à jour de contenu pour la refonte ?',
            '<span class="tag-q">Q —</span> Utilise-t-elle actuellement une plateforme de gestion des patients ou de dossier médical électronique ?'
          ],
          '.qa-item .why': [
            'Reçoivent-ils de vraies demandes ou surtout du spam ? La réponse détermine s’il faut conserver le formulaire actuel, ajouter une protection anti-spam comme reCAPTCHA ou un honeypot, ou basculer entièrement vers un outil de planification de type Calendly.',
            'S’ils n’en ont pas et restent ouverts à cette idée, ils pourraient utiliser la configuration de la boutique Stashbox.ai de Dean et y ajouter leur collection de produits ou de merchandising au lieu de créer une boutique séparée.',
            'Confirmer s’il faut ajouter de nouveaux services ou reprendre le contenu et les services actuels. Cela influence le périmètre et le calendrier de rédaction.',
            'Si oui, laquelle, par exemple SimplePractice, TherapyNotes, Kareo ou athenahealth ? Il faut vérifier si elle propose une API ou un portail intégrable afin que les patients se connectent directement à positivetherapyfl.com pour remplir leurs formulaires, payer ou consulter leurs fichiers, plutôt que d’utiliser un portail séparé. La faisabilité dépend entièrement de la plateforme et doit être confirmée avant le cadrage.'
          ],
          '.plan-card .tag': ['Éléments de marque', 'Mouvement', 'Visualisation'],
          '.plan-card h4': ['Ensemble d’images de marque intégrant le logo', 'Clips vidéo générés par IA', 'Infographies personnalisées'],
          '.plan-card p': [
            'Utiliser le logo existant pour produire un ensemble complet d’images de marque dans plusieurs formats :',
            'De courts clips produits par IA pour apporter un mouvement subtil aux pages clés, en remplaçant les anciennes animations statiques au défilement par de véritables contenus animés.',
            'Des infographies originales pour visualiser les sujets clés du site et offrir aux visiteurs une manière claire, rapide et partageable de comprendre des concepts actuellement expliqués uniquement dans de longs textes.'
          ],
          '.plan-card li': ['Vertical, format réseau social ou story', 'Carré, format fil ou profil', 'Horizontal, format bannière ou hero web'],
          '.tech-card .label': ['Plateforme', 'Indexabilité', 'Affichage mobile', 'Données structurées'],
          '.tech-card .val': ['CMS Webware.ai', 'index, follow', 'Configuré', 'Non confirmées'],
          '.rec-body h4': [
            'Consolider neuf pages satellites en 2 ou 3 véritables pôles régionaux',
            'Mettre en œuvre les schema LocalBusiness et FAQPage',
            'Ajouter llms.txt et une attribution d’auteur cohérente pour l’entité',
            'Remplacer les témoignages à initiales par des avis vérifiables et liés',
            'Réécrire le contenu pour supprimer les modèles et améliorer sa valeur comme source',
            'Supprimer la fenêtre contextuelle d’entrée et le modèle daté d’animation au défilement',
            'Réorienter le parcours principal de l’accueil vers la réservation, pas la newsletter',
            'Automatiser la synchronisation des avis Google et rediriger la collecte des nouveaux avis',
            'Consolider les étiquettes du blog en 5 à 8 catégories réutilisables'
          ],
          '.rec-body p': [
            'Remplacer le modèle ville par ville par des pages de comté réellement différenciées, par exemple Broward, Palm Beach et Miami-Dade, construites autour d’éléments distinctifs réels comme les réseaux d’assurance, la disponibilité régionale des thérapeutes et les partenariats locaux, et non de simples noms de villes remplacés.',
            'Ajouter des données structurées JSON-LD sur l’ensemble du site, notamment le balisage serviceArea, afin de représenter correctement le modèle de télésanté sans laisser croire à l’existence de neuf cabinets locaux.',
            'Publier un fichier llms.txt et harmoniser les noms et qualifications des praticiens sur toutes les pages afin que les moteurs de réponse identifient le cabinet comme une entité unique et fiable.',
            'Afficher des avis vérifiés issus de Google ou Healthgrades avec une attribution réelle lorsque les clients y consentent. Cela renforce la confiance des utilisateurs et la capacité des moteurs IA à citer le site.',
            'Remplacer les sections répétitives par un contenu original et précis pour chaque page, avec des qualifications concrètes, les modalités proposées et un contexte régional réel auquel les lecteurs et les moteurs génératifs peuvent se fier.',
            'Supprimer l’interruption au chargement et l’effet généralisé d’animation de tous les éléments afin d’offrir une première impression plus propre, en réservant le mouvement aux nouveaux contenus vidéo IA.',
            'Réorganiser le parcours principal de la page d’accueil pour conduire directement à la réservation ou à la demande de rendez-vous, en reléguant l’abonnement au rang d’option secondaire et non intrusive.',
            'Conserver l’importation dynamique des avis Google pour leur affichage sur le site et diriger l’appel à l’action « laisser un avis » vers le véritable lien de publication d’un avis Google, et non vers un formulaire interne.',
            'Remplacer les plus de 30 étiquettes qui se chevauchent par un petit ensemble stable réutilisé sur tous les articles. Cela construit une véritable profondeur thématique au lieu de la fragmenter entre des dizaines d’archives pauvres.'
          ],
          '.method-box p': [
            'Les scores sont des estimations indicatives issues de l’inspection du site en direct, notamment du HTML rendu, des balises meta, du contenu et des liens internes. Ils ne constituent pas un diagnostic vérifié par un crawler. Cet audit ne dispose pas d’un accès programmatique au contenu rendu par JavaScript ni aux données structurées intégrées dans des balises script. La présence ou l’absence de schema JSON-LD doit être confirmée manuellement avec le test des résultats enrichis de Google ou la commande « Afficher le code source ».',
            'Les scores projetés représentent l’estimation d’Elettro après une refonte complète traitant les constats ci-dessus, sur la base de missions comparables. Ils ne garantissent aucun classement précis dans les moteurs de recherche.'
          ],
          'footer .cta': ['Parlons de la refonte'],
          'footer .fine': ['Elettro, Inc. &middot; elettro.com &middot; Préparé pour un usage interne de présentation']
        }
      }
    }
  };

  const style = document.createElement('style');
  style.textContent = `
    .pt-global-nav {
      width:min(1080px, calc(100% - 48px));
      margin:20px auto 18px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      position:relative;
      z-index:100;
    }
    .pt-global-nav__group {
      display:inline-flex;
      align-items:center;
      gap:3px;
      padding:4px;
      border:1px solid #262B33;
      border-radius:999px;
      background:#14171C;
      box-shadow:0 8px 24px rgba(0,0,0,.24);
    }
    .pt-global-nav a,
    .pt-global-nav button {
      border:0;
      border-radius:999px;
      background:transparent;
      color:#9AA1AC;
      font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
      font-size:11px;
      font-weight:700;
      letter-spacing:.05em;
      line-height:1;
      padding:9px 13px;
      text-decoration:none;
      text-transform:uppercase;
      white-space:nowrap;
      cursor:pointer;
      transition:background-color .15s ease, color .15s ease;
    }
    .pt-global-nav a:hover,
    .pt-global-nav a:focus-visible,
    .pt-global-nav button:hover,
    .pt-global-nav button:focus-visible {
      color:#EDEFF2;
      outline:none;
    }
    .pt-global-nav .pt-page-active {
      background:#E8B34C;
      color:#1A1408;
    }
    .pt-global-nav .pt-language-active {
      background:#3FAE73;
      color:#07150D;
    }
    @media (max-width:620px) {
      .pt-global-nav {
        width:calc(100% - 24px);
        margin:12px auto;
        flex-wrap:wrap;
        justify-content:center;
      }
      .pt-global-nav__group {max-width:100%;}
      .pt-global-nav a,
      .pt-global-nav button {padding:8px 10px; font-size:10px;}
    }
  `;
  document.head.appendChild(style);

  document.querySelector('.page-switch-wrap')?.remove();
  document.querySelector('.page-nav')?.remove();

  const globalNav = document.createElement('div');
  globalNav.className = 'pt-global-nav';
  globalNav.innerHTML = `
    <nav class="pt-global-nav__group pt-page-switch" aria-label="Positive Therapy report views">
      <a data-page-link="audit" data-base="/clients/positive-therapy/index.html" href="/clients/positive-therapy/index.html">Audit</a>
      <a data-page-link="simple" data-base="/clients/positive-therapy/simple-practice/index.html" href="/clients/positive-therapy/simple-practice/index.html">SimplePractice</a>
    </nav>
    <div class="pt-global-nav__group pt-language-switch" role="group" aria-label="Language">
      <button type="button" data-language="en">English</button>
      <button type="button" data-language="es">Español</button>
      <button type="button" data-language="fr">Français</button>
    </div>
  `;
  document.body.insertBefore(globalNav, document.body.firstChild);

  const originals = {};
  selectors.forEach((selector) => {
    originals[selector] = Array.from(document.querySelectorAll(selector), (element) => element.innerHTML);
  });
  const originalTitle = document.title;

  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  const storedLanguage = localStorage.getItem(STORAGE_KEY);
  const initialLanguage = supportedLanguages.includes(requestedLanguage)
    ? requestedLanguage
    : supportedLanguages.includes(storedLanguage)
      ? storedLanguage
      : 'en';

  function applyValues(selector, values) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      if (typeof values[index] === 'string') element.innerHTML = values[index];
    });
  }

  function setLanguage(language, updateAddress = true) {
    const lang = supportedLanguages.includes(language) ? language : 'en';
    const languageData = translations[page]?.[lang];

    selectors.forEach((selector) => {
      const values = lang === 'en' ? originals[selector] : languageData?.groups?.[selector];
      if (values) applyValues(selector, values);
    });

    document.title = lang === 'en' ? originalTitle : languageData?.title || originalTitle;
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const navCopy = navigationCopy[lang];
    globalNav.querySelector('[data-page-link="audit"]').textContent = navCopy.audit;
    globalNav.querySelector('[data-page-link="simple"]').textContent = navCopy.simple;
    globalNav.querySelector('.pt-language-switch').setAttribute('aria-label', navCopy.language);

    globalNav.querySelectorAll('[data-page-link]').forEach((link) => {
      const targetPage = link.dataset.pageLink;
      link.classList.toggle('pt-page-active', targetPage === page);
      if (targetPage === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      link.href = `${link.dataset.base}?lang=${lang}`;
    });

    globalNav.querySelectorAll('[data-language]').forEach((button) => {
      const isActive = button.dataset.language === lang;
      button.classList.toggle('pt-language-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (updateAddress) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }

  globalNav.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });

  setLanguage(initialLanguage, true);
})();
