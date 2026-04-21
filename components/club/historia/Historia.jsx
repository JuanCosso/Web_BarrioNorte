"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* =========================================================
   UI COMPONENTS & UTILS
   ========================================================= */

// Textura de fondo sutil (ruido)
const BackgroundTexture = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

/**
 * Media SIN lightbox (sin click/zoom).
 * Mantiene el look (bordes, overlay, hover suave) pero no abre nada.
 */
function MediaFrame({
  src,
  alt,
  caption,
  aspect = "aspect-[4/3]",
  fit = "cover",
  overlay = true,
  padding = false,
  priority = false,
  unstyled = false, // <-- NUEVO
}) {
  return (
    <>
      <div className="w-full text-left relative">
        <div
          className={[
            "relative w-full",
            aspect,
            // Estilo “plano” (sin diseño)
            unstyled
              ? "overflow-hidden"
              : "overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-900",
            // padding solo si está estilizado (para docs)
            !unstyled && padding ? "p-4" : "",
          ].join(" ")}
        >
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              className={[
                fit === "contain" ? "object-contain" : "object-cover",
                // Hover solo si está estilizado
                unstyled ? "" : "transition-transform duration-700 group-hover:scale-[1.04]",
              ].join(" ")}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            {/* Overlay solo si está estilizado */}
            {!unstyled && overlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-55 transition-opacity duration-300 group-hover:opacity-40" />
            )}

            {/* Bisel sutil solo si está estilizado */}
            {!unstyled && (
              <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {caption ? (
        <p className="mt-3 text-xs text-neutral-500 font-mono border-l-2 border-red-900 pl-3">
          {caption}
        </p>
      ) : null}
    </>
  );
}


function Figure({ src, alt, caption, aspect = "aspect-[4/3]", variant = "photo" }) {
  const isDoc = variant === "doc";
  return (
    <figure className="my-8">
      <MediaFrame
        src={src}
        alt={alt}
        caption={caption}
        aspect={aspect}
        fit={isDoc ? "contain" : "cover"}
        overlay={!isDoc}
        padding={isDoc}
        unstyled={true} // <-- CLAVE: sin diseño en imágenes entre textos
      />
    </figure>
  );
}

function MediaGrid({ images, caption, cols, aspect, variant = "photo" }) {
  const isDoc = variant === "doc";
  const resolvedCols =
    cols ?? (isDoc ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2");
  const resolvedAspect = aspect ?? (isDoc ? "aspect-[3/4]" : "aspect-[4/3]");

  return (
    <figure className="my-8">
      <div className={`grid ${resolvedCols} gap-4`}>
        {images.map((img, i) => (
          <div key={`${img.src}-${i}`}>
            <MediaFrame
              src={img.src}
              alt={img.alt}
              caption={null}
              aspect={resolvedAspect}
              fit={isDoc ? "contain" : "cover"}
              overlay={!isDoc}
              padding={isDoc}
              unstyled={true} // <-- CLAVE
            />
          </div>
        ))}
      </div>

      {caption ? (
        <figcaption className="mt-2 text-xs text-neutral-500 font-mono pl-3 border-l-2 border-neutral-800">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}


/* =========================================================
   DATA (CONTENIDO ORIGINAL INTACTO)
   ========================================================= */

const HISTORY_DATA = [
  {
    id: "1948",
    range: "1948 - 1949",
    title: "Los Orígenes",
    imageSrc: "/historia/img_00_equipo-barrial.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Donde todo comenzó</strong>
          <p>
            Todo comienza en la zona norte de la ciudad de Gualeguay, donde
            diferentes grupos de muchachos se enfrentan entre sí con sus equipos
            barriales tales como Cañonazo, Tiro Federal, Defensores de Turf,
            entre otros.
          </p>
          <p>
            Es en este contexto, los gurises de las áreas aledañas al Hospital
            San Antonio forman su propio equipo y compiten en estos
            enfrentamiento bajo un nombre predilecto que los representaba, Club
            Atlético Barrio Norte, eligiendo como sus colores los del Club
            Estudiantes de La Plata, que aún a día de hoy se mantienen.
          </p>
        </li>

        <li>
          <div className="bg-neutral-900 border-l-4 border-red-600 p-4 rounded-r-lg">
            <strong className="text-white text-lg block">Primer campeonato</strong>
            <span className="text-neutral-300">
              EL lugar donde se hacía de local eran tierras prestadas por el Sr.
              Ramón Caffarena, ubicadas detrás del Hipódromo. Y es allí donde el
              equipo de los muchachos de Barrio Norte se consagra campeón por
              primera vez un 12 de octubre de 1949, con un gol marcado por Pablo
              Denardi de penal.
            </span>
            <p>
              Tras estos eventos se dispone crear una comisión directiva
              provisoria que se encargaría de concentrar a los vecinos y
              allegados para poner en marcha una institución que representara al
              barrio en lo deportivo y lo social. La misma es encabezada por
              Olivera, Paz, Cáceres, Denardi, Rógora, Ramírez, Lazo y Nauffal.
            </p>
          </div>
        </li>
      </ul>
    ),
  },

  {
    id: "1950",
    range: "1950 - 1959",
    title: "Grandes Avances",
    imageSrc: "/historia/foto_01.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <div className="bg-neutral-900 border-l-4 border-white/70 p-4 rounded-r-lg">
            <strong className="text-white text-lg block">Fundación</strong>
            <p className="text-neutral-300">
              El día 16 de agosto de 1950 en el sindicato de enfermeros se funda
              oficialmente el Club Atlético Barrio Norte, a través de una
              reunión realizada entre los vecinos, allí se estipulan los pasos a
              seguir, como la conformación en los meses posteriores de la
              subcomisión de fútbol y la futura elección de autoridades
              encargadas de tomar las riendas del club.
            </p>
            <p>
              El 25 de Enero de 1951 sale vencedor Luis Campagnola, quien queda
              a cargo de la presidencia de Barrio Norte.
            </p>
          </div>
        </li>

        <li>
          <strong className="text-white">El terreno</strong>
          <p>
            La comisión directiva decide elevar una nota al intendente Dr. Juan
            José Rojas, ese mismo año, a los efectos de solicitar el terrno
            situado en Av. Soberanía y Schiaffino, para construir en ese terreno
            desocupado la nueva sede y el campo de deportes.
          </p>
          <p>
            El intendente responde de manera favorable el día 2 de Junio de
            1951, cediendo el predio por el plazo de 20 años.
          </p>

          <MediaGrid
            variant="doc"
            images={[
              {
                src: "/historia/img_01_pedido-terrenos.jpg",
                alt: "Solicitud de tierras presentada al intendente",
              },
              {
                src: "/historia/img_02_agradecimiento-terrenos.jpg",
                alt: "Agradecimiento / documentación vinculada al predio",
              },
            ]}
            caption="Cartas originales."
          />

          <p>
            El lugar era bastante carenciado en su época, simplemente había un
            terreno disparejo con plantas, charcos de agua y un famoso algarrobo
            que estará presente con su sombra en las charlas de los norteños.
          </p>
        </li>

        <li>
          <strong className="text-white">Con el apoyo de la gente</strong>
          <p>
            Tras adquirir el terreno se lo nivela, se plantan eucaliptos, se
            marca la cancha de fútbol y se construye una habitación a la que se
            le dió múltiples utilidades como salón de reuniones, vestuario,
            secretaria y guardarropa. Todo hecho a costa de personas que salían
            de su trabajo y relegaban horas de descanso para seguir mejorando la
            institución sin cobro alguno.
          </p>
        </li>

        <li>
          <strong className="text-white">Los bailes de Barrio Norte</strong>
          <p>
            Una actividad inicial muy importante para la expansión del club
            fueron los bailes. El primero de ellos se realizó en la pista Bur,
            pero luego tras desacuerdos económicos, los norteños deciden utilizar
            sus conocimientos de oficio en albañilería para crear el terrno de
            la pista de baile que sería frecuentada por bandas y orquestas.
          </p>

          <Figure
            variant="doc"
            src="/historia/img_03_anuncio-baile.jpg"
            alt="Publicidad en diarios"
            caption="Publicidad en diarios."
            aspect="aspect-[16/10]"
          />
        </li>
      </ul>
    ),
  },

  {
    id: "1952",
    range: "1952 - 1959",
    title: "El fútbol",
    imageSrc: "/historia/img_06_primer-equipo.jpg",
    content: (
      <ul className="space-y-4">
        <li>
          <strong className="text-white">Burocracia</strong>
          <p>
            En el año 1952 Barrio Norte se afilia a la Liga Departamental de
            Fútbol de Gualeguay, presentando equipos de difisiones inferiores
            (segunda, cuarta y quinta), siendo la primera la que debuta por
            primera vez en la historia en una derrota 1 a 0 contra Gualeguay
            Central en cancha de Sociedad Sportiva.
          </p>

          <MediaGrid
            variant="doc"
            images={[
              {
                src: "/historia/img_04_anuncio-debut.jpg",
                alt: "Anuncio del debut",
              },
              {
                src: "/historia/img_05_carta-afiliacion.jpg",
                alt: "Afiliación a la Liga Departamental",
              },
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
            de los vecinos
          </p>
        </li>
        <li>
          <strong className="text-white">Cómo era Barrio Norte</strong>{" "}
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
            actividades. Para ellos se realizan rifas con el fin de comprar
            arena, ladrillos, cemento, para la construcción del salón de
            eventos. En paralelo, la Municipalidad le otorga la titularidad del
            terreno al club y cede la parte delantera del predio para que se
            construyan viviendas en el barrio.
          </p>
          <p>
            Comienza a haber representación en pesca hacia 1962, con su
            respectiva subcomisión, para luego en 1963 sumarse la famosa y
            popular actividad de las bochas
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
            encuentro en las cancha de tierra por lo que se plantea a futuro
            crear una cancha en condiciones.
          </p>
        </li>
        <li>
          <strong className="text-white">Planteles de la época</strong>{" "}
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
            pista de baile original, tiene un uso más mixto en este momento,
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
          <strong className="text-white">Sucesos</strong>{" "}
          <p>
            Esta década se caracteriza por seguir la secuencia de funcionamiento
            antes mencionada con la adición de que Barrio Norte participa de los
            carnavales realizados en la calle San Antonio Norte.
          </p>
          <p>
            Para 1983 se construye una cancha de baby iluminada y al siguiente
            años se colocan tribunas de hormigón en la cancha de fútbol y como
            siempre, todo realizado con el apoyo de las personas del club y sus
            allegados que buscaban mejorar la insfraestructura para luego
            disfrutarla.
          </p>
        </li>
        <li>
          <strong className="text-white">Ámbito futbolístico</strong>
          <p>
            El club ondaba en zonas medias-bajas de la tabla, por lo que desde
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
            Nosiglia, se destaca en la historia por ser el técnico más ganador
            de la historia del club. Para el año 1999 Barrio Norte se consagra
            campeón de uno de los dos torneos que se juegan ese año, en un
            formato Apertura y Clausura similar al que se frecuentaba en esos
            años en las máximas categorías del fútbol argentino.
          </p>
          <p>
            En el año 2001 se obtiene nuevamente el campeonato local, además de
            un torneo nocturo jugado en la ciudad de Victoria y la Copa Mateo
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
            CAminos y luego Raúl Forti. El capitán y goleador era Mariano
            Vecchio, quien convirtiera el gol en la final para ganar el título.
          </p>
          <p></p>
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
            Verá, representando a Barrio Norte.La primer directora fue Alba
            Repetto y luego han estado nombres como Norma Senize, José Luis
            Galarza y Walter Testa.
          </p>
          <p>
            A lo largo de la historia, se han levantado un total de 6
            campeonatos, donde siempre Samba Verá ha destacado por sus grandes
            bandas, músicos, percusionistas, bailarines, animadores, modistas,
            pasistar e integrantes.
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
            de Alejandra Zeballos, que aún hoy en día esta al frente del
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
            inicio de año
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
            final ante Urquiza tras una serie ida y vuelta muy recordada
          </p>
        </li>
        <li>
          <strong className="23utext-white">Otra vez bicampeón</strong>
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

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export default function Historia() {
  return (
    <section className="relative w-full bg-neutral-950 min-h-screen text-neutral-200 overflow-x-hidden">
      <BackgroundTexture />

      {/* Luces decorativas */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-24 right-[-120px] w-[520px] h-[520px] bg-white/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 sm:py-20">
        {/* ENCABEZADO (más chico + efecto visual) */}
        <header className="text-center mb-20 sm:mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative inline-block"
          >
            {/* Glow animado detrás del título */}
            <motion.div
              aria-hidden="true"
              className="absolute -inset-x-10 -inset-y-6 bg-red-600/10 blur-3xl rounded-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            />

            <motion.h1
              className="relative text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black tracking-tight text-white uppercase"
              initial={{ letterSpacing: "-0.03em" }}
            >
              Nuestra{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-600 shimmer">
                Historia
              </span>
            </motion.h1>

            {/* Línea animada */}
            <motion.div
              className="relative h-1.5 w-36 mx-auto mt-5 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.55)]"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
              style={{ transformOrigin: "center" }}
            />
          </motion.div>

          <motion.p
            className="text-neutral-400 mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-light leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          >
            Un barrio que crece con identidad y humildad.
          </motion.p>
        </header>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-24 sm:gap-28 lg:gap-36 pb-20">
          {HISTORY_DATA.map((era, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={era.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-15%", once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group w-full"
              >
                {/* Año gigante de fondo (decorativo) */}
                <div
                  className={`absolute top-[-34px] md:top-[-70px] z-0 pointer-events-none select-none ${
                    isEven ? "left-0 md:-left-10" : "right-0 md:-right-10 w-[520px] md:w-[620px] text-left"

                  }`}
                >
                  <span
                    className="text-[110px] md:text-[210px] font-black leading-none text-transparent opacity-20"
                    style={{ WebkitTextStroke: "2px rgba(255,255,255,0.14)" }}
                  >
                    {era.id}
                  </span>
                </div>

                <div
                  className={`relative z-10 flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-10 lg:gap-16 items-center lg:items-start`}
                >
                  {/* Columna Texto (SIEMPRE alineado a la izquierda) */}
                  <div className="flex-1 w-full pt-6">
                    <div className="relative mb-6">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                        {era.title}
                      </h2>
                      <div className="h-1 w-20 bg-red-600 rounded-full" />
                    </div>

                    <div className="history-content text-left text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-neutral-300 font-light">
                      {era.content}
                    </div>
                  </div>

                  {/* Columna Imagen (sin click/zoom) */}
                  <div className="flex-1 w-full lg:w-1/2">
                    <div className={`relative ${isEven ? "lg:mr-auto" : "lg:ml-auto"} max-w-xl mx-auto lg:max-w-none`}>
                      <div className="absolute -inset-4 bg-red-600/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 transform transition-transform duration-700 group-hover:-translate-y-1">
                        <MediaFrame
                          src={era.imageSrc}
                          alt={era.title}
                          aspect="aspect-[4/3]"
                          fit="cover"
                          overlay={true}
                          padding={false}
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CSS mínimo para el “shimmer” del título, sin depender de config Tailwind */}
      <style jsx global>{`
        .shimmer {
          background-size: 200% 100%;
          animation: shimmerMove 3.5s linear infinite;
        }
        @keyframes shimmerMove {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
      `}</style>
    </section>
  );
}
