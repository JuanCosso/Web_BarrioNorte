import { Figure, MediaGrid } from "./MediaComponents";

/* =========================================================
   HISTORY_DATA

   Cada era usa UNO de estos dos modos:

   ── MODO CLÁSICO (mayoría de eras) ──────────────────────
   imageSrc + content (JSX)
   Opcional: floatImage: true → imagen flotada tipo libro

   ── MODO SECTIONS (layout personalizado por bloques) ─────
   sections: [ ...bloques ]
   No lleva imageSrc ni content.

   Cada bloque de sections acepta:
     title          → subtítulo
     texts          → ["párrafo 1", "párrafo 2", ...]
     highlight      → true = card con borde blanco lateral

     imagePosition  → "right" (default) | "left"
     imageSrc       → ruta de imagen
     imageAspect    → "4/3" | "16/9" | "16/10" | "3/4"  (default "4/3")
     imageContain   → true = object-contain (para docs/cartas)
     imageCaption   → pie de foto

     docs           → [{ src, alt }, ...]
     docsCols       → 1 | 2  (default automático)
     docsCaption    → pie de los docs
   ========================================================= */

export const HISTORY_DATA = [
  {
    id: "1948",
    range: "1948 - 1949",
    title: "Los Orígenes",
    imageSrc: "/historia/img_00_equipo-barrial.jpg",
    floatImage: true,
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Torneos amateurs</strong>
          <p>
            Todo comienza en la zona norte de la ciudad de Gualeguay, un espacio semivacío y marginal para la época, donde
            diferentes grupos de muchachos se enfrentan entre sí regularmente, practicando el más popular de los deportes, el fútbol, con sus equipos
            barriales tales como Cañonazo, Tiro Federal, Defensores de Turf,
            entre otros.
          </p>
          <p>
            Es en este contexto que los gurises de las áreas aledañas al Hospital
            San Antonio forman su propio equipo y compiten en estos
            enfrentamientos bajo un nombre predilecto que los representaba, Barrio Norte, eligiendo como sus colores los del Club
            Estudiantes de La Plata, que aún a día de hoy se mantienen.
          </p>
        </li>
        <li>
          <strong className="text-white">Primer campeonato</strong>
          <p>
            El lugar donde se hacían las veces de local eran tierras prestadas por el Sr.
            Ramón Caffarena, ubicadas detrás del Hipódromo de la ciudad. Y es allí donde un 12 de octubre de 1949, el novedoso
            equipo de los gurises de Barrio Norte se consagra campeón por
            primera vez, con un gol marcado por Pablo
            Denardi de penal.
          </p>
          <p>
            Tras estos eventos se dispone formalizar la organización, crear una comisión directiva
            provisoria que se encargue de concentrar a los vecinos y
            allegados para poner en marcha una institución que representara al
            barrio en lo deportivo y lo social. La misma es encabezada por
            Olivera, Paz, Cáceres, Denardi, Rógora, Ramírez, Lazo y Nauffal.
          </p>
        </li>
      </ul>
    ),
  },

  /* ── 1950: usa sections para layout personalizado ── */
  {
    id: "1950",
    range: "1950 - 1959",
    title: "Primeros pasos",
    sections: [
      /* Fila 1: card Fundación (izq) | foto principal (der) */
      {
        title: "Fundación",
        highlight: true,
        texts: [
          "El día 16 de agosto de 1950 en el sindicato de enfermeros de la ciudad, se funda oficialmente el Club Atlético Barrio Norte, a través de una reunión realizada entre los vecinos, allí se estipulan los pasos a seguir, contemplando formalidades como la conformación en los meses posteriores de la subcomisión de fútbol y la futura elección de autoridades encargadas de tomar las riendas del club.",
          "El 25 de Enero de 1951 sale vencedor de dicha elección Luis Campagnola, quien queda a cargo de la presidencia de Barrio Norte.",
        ],
        imageSrc: "/historia/foto_01.jpg",
        imagePosition: "left",
        imageAspect: "4/3",
      },

      /* Fila 2: texto El terreno (izq) | dos cartas en grilla (der) */
      {
        title: "El terreno",
        texts: [
          "Ese mismo año, la comisión directiva decide elevar una nota al intendente Dr. Juan José Rojas a los efectos de solicitar el terreno situado en Av. Soberanía y Schiaffino, para construir en ese terreno desocupado la nueva sede y el campo de deportes.",
          "El intendente responde de manera favorable el día 2 de Junio de 1951, cediendo el predio por el plazo de 20 años.",
          "El lugar era bastante carenciado en su época, simplemente había un terreno disparejo con plantas, charcos de agua y un famoso algarrobo que estará presente con su sombra en las charlas sobre los proyectos del club.",
        ],
        docs: [
          { src: "/historia/img_01_pedido-terrenos.jpg",        alt: "Solicitud de tierras presentada al intendente" },
          { src: "/historia/img_02_agradecimiento-terrenos.jpg", alt: "Agradecimiento / documentación vinculada al predio" },
        ],
        /* imagePosition no aplica a docs — los docs siempre van a la derecha por defecto */
      },

      /* Fila 3: foto (izq) | Con el apoyo de la gente (der) */
      {
        title: "Con el apoyo de la gente",
        texts: [
          "Tras adquirir el terreno se lo nivela, se plantan eucaliptos, se marca la cancha de fútbol y se construye una habitación a la que se le dió múltiples utilidades como salón de reuniones, vestuario, secretaria y guardarropa. Todo hecho a costa de personas que salían de su trabajo y relegaban horas de descanso para seguir mejorando la institución sin cobro alguno.",
        ],
        imageSrc: "/historia/img_10_cena-aniversario.jpg", // → reemplazá por la foto real cuando la tengas
        imagePosition: "left",
        imageAspect: "4/3",
      },

      /* Fila 4: Los bailes (izq) | anuncio de diarios (der) */
      {
        title: "Los bailes de Barrio Norte",
        texts: [
          "Una actividad inicial muy importante para la expansión del club fueron los bailes. El primero de ellos se realizó en la pista Bur, pero luego tras desacuerdos económicos, los norteños deciden utilizar sus conocimientos de oficio en albañilería para crear el terreno de la pista de baile que sería frecuentada por bandas y orquestas.",
        ],
        imageSrc: "/historia/img_03_anuncio-baile.jpg",
        imagePosition: "right",
        imageAspect: "16/10",
        imageContain: true,
        imageNarrow: true,
      },
    ],
  },

  {
    id: "1952",
    range: "1952 - 1959",
    title: "El fútbol",
    imageSrc: "/historia/img_07_primer-equipo(inferiores).jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Afiliación</strong>
          <p>
            En el año 1952 Barrio Norte se afilia a la Liga Departamental de
            Fútbol de Gualeguay, presentando equipos de divisiones inferiores
            (segunda, cuarta y quinta), siendo la primera la que debuta por
            primera vez en la historia en una derrota 1 a 0 contra Gualeguay
            Central en cancha de Sociedad Sportiva.
          </p>

          <MediaGrid
            variant="doc"
            images={[
              { src: "/historia/img_04_anuncio-debut.jpg",    alt: "Anuncio del debut" },
              { src: "/historia/img_05_carta-afiliacion.jpg", alt: "Afiliación a la Liga Departamental" },
            ]}
            caption="Registros históricos."
          />

          <strong className="text-white">Primer plantel de 1ra</strong>
          <p>
            Recién hacia el año 1955 se logra formar una primera división que
            represente al club. Dirigidos por Adán Lezcano y Ricardo "Toto"
            Benítez como ayudante, el equipo se conformó por: Gómez, Olivera,
            Denardi, Rógora, Cánepa, Amarillo, Bur, Tassistro, Piaggio, Recalde
            y Reynoso.
          </p>
          <p>
            En este mismo año, la Municipalidad de Gualeguay le otorga la
            personería jurídica al Club Atlético Barrio Norte. El club sigue
            creciendo de a poco en su zona de influencia, siempre con la ayuda
            de los vecinos.
          </p>
        </li>
        <li>
          <strong className="text-white">Cómo era Barrio Norte</strong>
          <p>
            Las camisetas en esta década eran de mangas largas a rayas,
            fabricadas por la agrupación de damas del club, que tenían los
            llamados "tucos", una especie de abrojo que se sacaba para lavar la
            indumentaria.
          </p>
          <p>
            Esto siempre caracterizaba el día a día, la supervivencia. Lejos
            estaban las pretenciones deportivas, que se podían presentar en
            otras instituciones que ya tenían 40 años de historia, mayor poder
            adquisitivo y político. Por lo que durante esta década y la
            posterior Barrio Norte oscila entre la Primera "A" y la Primera "B"
            de la Liga Departamental de Gualeguay.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "1960",
    range: "1960 - 1969",
    title: "Nuevos Horizontes",
    imageSrc: "/historia/foto_02.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Expansión</strong>
          <p>
            Durante estos años, Barrio Norte busca abrirse paso en diferentes
            actividades. Para ello se realizan rifas con el fin de comprar
            arena, ladrillos, cemento, para la construcción del salón de
            eventos. En paralelo, la Municipalidad le otorga la titularidad del
            terreno al club y cede la parte delantera del predio para que se
            construyan viviendas en el barrio.
          </p>
          <p>
            Comienza a haber representación en pesca hacia 1962, con su
            respectiva subcomisión, para luego en 1963 sumarse la famosa y
            popular actividad de las bochas.
          </p>
        </li>
        <li>
          <strong className="text-white">Obras</strong>
          <p>
            Para 1968 tras una importante inversión, se finaliza el salón con la
            colocación de su techo, el mismo es inaugurado con una gran fiesta.
          </p>
          <p>
            El deporte de las bochas reúne varias personas a disputar sus
            encuentros en las canchas de tierra por lo que se plantea a futuro
            crear una cancha en condiciones.
          </p>
        </li>
        <li>
          <strong className="text-white">Planteles de la época</strong>
          <p>IMG de los planteles</p>
        </li>
      </ul>
    ),
  },

  {
    id: "1970",
    range: "1970 - 1979",
    title: "Afianzamiento",
    imageSrc: "/historia/img_08_campeones-1974(bien).png",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Sigue la expansión</strong>
          <p>
            En 1971 se empieza a construir la cancha de bochas, al lado del
            salón (a día de hoy se mantiene en uso).
          </p>
          <p>
            El Sr. Juan Larrateguy comienza este mismo año con la enseñanza de
            básquet, con pequeños grupos que al tiempo ganan notoriedad. La
            pista de baile original tiene un uso más mixto en este momento,
            donde también se emplea de esta manera.
          </p>
          <p>
            Barrio Norte se destacará luego en la rama femenina de este deporte,
            que había arrancado justamente hace pocos años, en comparación al
            masculino que estaba muy desarrollado en otras instituciones como BH
            y Sportiva.
          </p>
        </li>
        <li>
          <strong className="text-white">Bicampeonato</strong>
          <p>
            En el año 1974, con Pocha Badaracco a la cabeza, Barrio Norte
            obtiene el Campeonato de Preparación, en ese momento de la Primera
            "B". Este título se repite para el siguiente año 1975 con el mismo
            cuerpo técnico al mando.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "1980",
    range: "1980 - 1989",
    title: "Años 80s",
    imageSrc: "/historia/foto_07.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Sucesos</strong>
          <p>
            Esta década se caracteriza por seguir la secuencia de funcionamiento
            antes mencionada con la adición de que Barrio Norte participa de los
            carnavales realizados en la calle San Antonio Norte.
          </p>
          <p>
            Para 1983 se construye una cancha de baby iluminada y al siguiente
            año se colocan tribunas de hormigón en la cancha de fútbol y como
            siempre, todo realizado con el apoyo de las personas del club y sus
            allegados que buscaban mejorar la infraestructura para luego
            disfrutarla.
          </p>
        </li>
        <li>
          <strong className="text-white">Ámbito futbolístico</strong>
          <p>
            El club andaba en zonas medias-bajas de la tabla, por lo que desde
            la subcomisión de fútbol se decide cambiar la mentalidad, imponer
            una manera de trabajo con bases en la constancia, seriedad y
            entrenamiento.
          </p>
          <p>
            Esto da sus frutos porque a medida que se avanza en la década van
            mejorando los jugadores, tanto los propios como los que se acercan
            por primera vez, hasta el subcampeonato de 1989, donde se pierde por
            1 punto el título que obtiene finalmente El Progreso, estos sucesos
            marcan la fórmula que dará grandes frutos en los siguientes años.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "1990",
    range: "1990 - 1995",
    title: "Primer Campeonato",
    imageSrc: "/historia/img_09_primer-campeonato.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Al mando de Rubito</strong>
          <p>
            El primer campeonato oficial se obtuvo en el año 1990, bajo la
            conducción de Rubén Garibotti, el mismo que fuese hincha, posterior
            jugador, técnico, campeón y hoy en día presidente. Esto marca un
            antes y un después ya que mostró el correcto camino a seguir, y
            propiamente un hito, a 40 años de la fundación el primer título
            oficial.
          </p>
          <p>
            En el año 1992 se logra finalizar el techo parabólico emergido sobre
            la antigua pista de baile, también devenida en ese momento a la
            utilización en diferentes disciplinas.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "1995",
    range: "1995 - 1997",
    title: "La aventura nacional",
    imageSrc: "/historia/foto_05.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">La campaña</strong>
          <p>
            Hacia el año 1995, el plantel de Barrio Norte liderado por Mario
            Raúl Correa y su ayudante Antonio Reynoso se consagra campeón
            invicto de la Liga Departamental, obteniendo así el derecho de
            participar del Torneo Argentino "B".
          </p>
          <p>
            Este torneo era un salto gigantesco para la institución, en lo
            deportivo, lo edilicio y lo económico. Sobran las anécdotas de
            quienes participaran de aquella campaña donde dirigentes dormían en
            el piso de los hoteles, las comidas eran preparadas por las damas
            del club y las hazañas se iban cumpliendo a medida que avanzaba el
            tiempo.
          </p>
        </li>
        <li>
          <strong className="text-white">Resultados</strong>
          <p>
            Se traen refuerzos de Rosario, Paraná, Corrientes y Buenos Aires, en
            conjunto con jugadores de toda la vida como el "Colo" Sánchez, que
            era el capitán. La primer mitad del torneo dirige Correa y Reynoso
            para luego darle paso a Rubén Garibotti y Jesús Gómez.
          </p>
          <p>
            El esfuerzo dió sus frutos ya que fue la mejor campaña nacional de
            la historia de un equipo gualeyo, se llegó a semifinales donde
            caímos ante Brown de Arrecifes, quien fuera el equipo que ascendiera
            al Torneo Argentino "A" y posteriormente al Nacional "B". Sin dudas
            este es un gran recuerdo que ha todos llena de orgullo.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "1998",
    range: "1998 - 2004",
    title: "La época dorada",
    imageSrc: "/historia/foto_11.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Los años más ganadores</strong>
          <p>
            El club participa nuevamente en el Torneo Argentino "B" de la
            temporada 1997, donde cae eliminado en la segunda ronda. Para 1998
            asume como DT Nicolino Rafael Nosiglia, quien el torneo anterior
            fuera ayudante de campo de Héctor "El Gallego" Caminos.
          </p>
          <p>
            Nosiglia se destaca en la historia por ser el técnico más ganador
            de la historia del club. Para el año 1999 Barrio Norte se consagra
            campeón de uno de los dos torneos que se juegan ese año, en un
            formato Apertura y Clausura similar al que se frecuentaba en esos
            años en las máximas categorías del fútbol argentino.
          </p>
          <p>
            En el año 2001 se obtiene nuevamente el campeonato local, además de
            un torneo nocturno jugado en la ciudad de Victoria y la Copa Mateo
            Martínez, pero esta no sería la mayor alegría del año.
          </p>
        </li>
        <li>
          <strong className="text-white">El Regionalito</strong>
          <p>
            Bajo esta denominación se conocía al actual campeonato de Copa Entre
            Ríos, allí se enfrentaban los mejores de cada liga peleando por una
            plaza para competir en el Torneo Argentino "B".
          </p>
          <p>
            Se cierra con broche de oro este año cuando en la final ante
            Juventud de Caseros, Barrio Norte se impone y gana su primer
            campeonato provincial, el único hasta la fecha.
          </p>
        </li>
        <li>
          <strong className="text-white">La estrella</strong>
          <p>
            En el año 2004 Barrio Norte se consagra campeón de la Liga
            Departamental, durante el torneo estuvieron a cargo "El Gallego"
            Caminos y luego Raúl Forti. El capitán y goleador era Mariano
            Vecchio, quien convirtiera el gol en la final para ganar el título.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "2005",
    range: "2005 - 2009",
    title: "El color del Norte",
    imageSrc: "/historia/foto_09.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Comienzo</strong>
          <p>
            La plaza en el Carnaval de Gualeguay se le compra a Libertad en el
            año 2005, y al siguiente año se crea oficialmente la comparsa Samba
            Verá, representando a Barrio Norte. La primer directora fue Alba
            Repetto y luego han estado nombres como Norma Senize, José Luis
            Galarza y Walter Testa.
          </p>
          <p>
            A lo largo de la historia, se han levantado un total de 6
            campeonatos, donde siempre Samba Verá ha destacado por sus grandes
            bandas, músicos, percusionistas, bailarines, animadores, modistas,
            pasistas e integrantes.
          </p>
          <p>
            Cada año, se involucran miles de personas desde la confección de
            carrozas y vestidos, puesta en escena de conceptos y bandas sonoras,
            hasta los servicios de catering y cantina que se pueden prestar,
            todo con norteños que se ponen a la institución en la espalda, como
            la historia ha marcado.
          </p>
        </li>
        <li>
          <strong className="text-white">Gimnasia Rítmica</strong>
          <p>
            La Escuela de Gimnasia Rítmica de Barrio Norte nace en 2006 a cargo
            de Alejandra Zeballos, que aún hoy en día está al frente del
            proyecto.
          </p>
          <p>
            Hacia 2009 Barrio Norte se adhiere a la Federación Entrerriana de
            Gimnasia, y desde 2010 participa de Torneos Nacionales Federativos.
            Es muy valioso el semillero que aglomera alrededor de 60 gimnastas.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "2010",
    range: "2010 - 2011",
    title: "La catástrofe",
    imageSrc: "/historia/foto_10.jpeg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">El dolor de la destrucción</strong>
          <p>
            El 12 de enero de 2010, una cola de tornado con vientos de hasta 100
            km/h golpea la zona norte de la ciudad, dejando la infraestructura
            del club muy anegada. Techos volados, tribunas rotas, carrozas
            destrozadas a días del comienzo del carnaval, marcaron un caótico
            inicio de año.
          </p>
          <p>
            Con ayuda de los vecinos de la ciudad, el gobierno municipal y
            provincial, el club se logra recuperar de los daños materiales a los
            pocos años del evento.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "2012",
    range: "2012 - 2021",
    title: "Eventualidades",
    imageSrc: "/historia/foto_11.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Tenis</strong>
          <p>
            En el año 2012 durante la presidencia de Miguel Cosso se comenzó con
            el dictado de clases de tenis para niños, adolescentes y adultos
            bajo la tutela del profesor José Samuel. Ese año Barrio Norte se
            afilia a la Federación Entrerriana de Tenis, la cancha utilizada era
            la vieja pista de baile reacondicionada para el deporte. Hoy en día
            Barrio Norte cuenta con 2 canchas de polvo de ladrillo para la
            práctica del deporte.
          </p>
        </li>
        <li>
          <strong className="text-white">Copa Entre Ríos</strong>
          <p>
            En 2016, la primer edición oficial de la nueva Copa Entre Ríos,
            antes llamada Regionalito, Barrio Norte sale subcampeón tras perder
            una final donde se había remontado un 3 a 0 abajo inicial, pero
            finalmente se pierde por penales ante San José Obrero de Mocoretá.
          </p>
        </li>
        <li>
          <strong className="text-white">Pandemia</strong>
          <p>
            La pandemia de Covid-19 afecta al mundo en el año 2020 lo que relega
            al club a permanecer cerrado y tarda más de un año y medio en
            volverse a introducir al normal funcionamiento. Estos años de
            aislamiento afianzan la venta de la rifa de una casa que realiza el
            club anualmente, una fuente considerable del presupuesto anual.
          </p>
        </li>
      </ul>
    ),
  },

  {
    id: "2022",
    range: "2022 - 2026",
    title: "Grandes Conquistas",
    imageSrc: "/historia/foto_10.jpeg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Bicampeonato</strong>
          <p>
            Después de 18 años sin títulos en el fútbol, Barrio Norte sale
            campeón ante Urquiza en cancha de Bancario, de lo que sería el
            Campeonato Oficial 2021/22, el primero realizado post-pandemia.
          </p>
          <p>
            El torneo del año 2022 también queda bajo nuestra posesión en otra
            final ante Urquiza tras una serie ida y vuelta muy recordada.
          </p>
        </li>
        <li>
          <strong className="text-white">Otra vez bicampeón</strong>
          <p>
            En 2024 se repite la hazaña con el "Beto" con la obtención del
            Torneo Preparación y el Oficial.
          </p>
        </li>
        <li>
          <strong className="text-white">Mensaje especial</strong>
          <p>
            La historia se sigue escribiendo y lo está haciendo como nuestra
            historia marca, con los norteños poniendo alma y cuerpo con el único
            objetivo de que Barrio Norte siga creciendo como club, para darle
            más espacios, mejores herramientas a los propios y un prestigio que
            se rige en los valores de la honestidad, el trabajo y el compromiso.
          </p>
        </li>
      </ul>
    ),
  },
];