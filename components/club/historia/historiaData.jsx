import { Figure, MediaGrid } from "./MediaComponents";
import { FlatImage } from "./MediaComponents";

export const HISTORY_DATA = [
  {
    id: "1948",
    range: "1948 - 1949",
    title: "Los orígenes",
    imageSrc: "/historia/img_00_equipo-barrial.jpg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= TORNEOS AMATEURS ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Torneos amateurs</strong>
          {/* Si algún día querés poner otra foto acá, insertás el <FlatImage /> en esta línea */}
          <p className="mb-3">
            Todo comienza en la zona norte de la ciudad de Gualeguay, un espacio semivacío y marginal para la época, donde
            diferentes grupos de muchachos se enfrentan entre sí regularmente, practicando el más popular de los deportes, el fútbol, con sus equipos
            barriales tales como Cañonazo, Tiro Federal, Defensores de Turf,
            entre otros.
          </p>
          <p className="mb-3">
            Es en este contexto que los gurises de las áreas aledañas al Hospital
            San Antonio forman su propio equipo y compiten en estos
            enfrentamientos bajo un nombre predilecto que los representaba, Barrio Norte, eligiendo como sus colores los del Club
            Estudiantes de La Plata, que aún a día de hoy se mantienen.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= PRIMER CAMPEONATO ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Primer campeonato</strong>
          <p className="mb-3">
            El lugar donde se hacían las veces de local eran tierras prestadas por el Sr.
            Ramón Caffarena, ubicadas detrás del Hipódromo de la ciudad. Y es allí donde un 12 de octubre de 1949, el novedoso
            equipo de los gurises de Barrio Norte se consagra campeón por
            primera vez, con un gol marcado por Pablo
            Denardi de penal.
          </p>
          <p className="mb-3">
            Tras estos eventos se dispone formalizar la organización, crear una comisión directiva
            provisoria que se encargue de concentrar a los vecinos y
            allegados para poner en marcha una institución que representara al
            barrio en lo deportivo y lo social. La misma es encabezada por
            Olivera, Paz, Cáceres, Denardi, Rógora, Ramírez, Lazo y Nauffal.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  /* ── 1950: usa sections para layout personalizado ── */
  {
    id: "1950",
    range: "1950 - 1959",
    title: "Primeros pasos",
    imageSrc: "/historia/foto_01.jpg", 
    floatImage: true, 
    content: (
      <div className="space-y-6">
        
        {/* ================= FUNDACIÓN ================= */}
        <div className="flow-root bg-neutral-900 border-l-4 border-white/70 p-5 rounded-r-lg mb-6">
          <strong className="text-white text-lg block mb-2">Fundación</strong>
          <p className="mb-3 text-neutral-300">
            El día 16 de agosto de 1950 en el sindicato de enfermeros de la ciudad, se funda oficialmente el Club Atlético Barrio Norte, a través de una reunión realizada entre los vecinos, allí se estipulan los pasos a seguir, contemplando formalidades como la conformación en los meses posteriores de la subcomisión de fútbol y la futura elección de autoridades encargadas de tomar las riendas del club.
          </p>
          <p className="text-neutral-300">
            El 25 de Enero de 1951 se realiza esta elección de la cual sale vencedor Luis Campagnola, quien queda a cargo de la presidencia de Barrio Norte.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= EL TERRENO ================= */}
        <div>
          {/* Subtítulo PRIMERO, arriba de todo */}
          <strong className="text-white text-lg block mb-2">El terreno</strong>
          
          <FlatImage 
            src="/historia/img_01_pedido-terrenos.jpg" 
            alt="Solicitud de tierras al intendente" 
            align="right" 
            width="w-full sm:w-[25%]" // <-- Imagen reducida (antes era 35%)
          />
          <p className="mb-3">
            Ese mismo año, la comisión directiva decide elevar una nota al intendente Dr. Juan José Rojas a los efectos de solicitar un terreno desocupado situado en Av. Soberanía y Schiaffino, para construir en el mismo la nueva sede y el campo de deportes.
          </p>
          
          <p className="mb-3">
            El intendente responde de manera favorable el día 2 de Junio de 1951, cediendo el predio por el plazo de 20 años.
          </p>
          
          <FlatImage 
            src="/historia/img_02_agradecimiento-terrenos.jpg" 
            alt="Agradecimiento vinculado al predio" 
            align="right" 
            width="w-full sm:w-[25%]" // <-- Imagen reducida
          />
          <p className="mb-3">
            El lugar era bastante carenciado para ese momento, simplemente había un terreno disparejo con plantas, charcos de agua y un famoso algarrobo que estará presente con su sombra en las charlas sobre los proyectos del club.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= CON EL APOYO DE LA GENTE ================= */}
        <div>
          {/* Imagen LUEGO, a la izquierda */}
          <FlatImage 
            src="/historia/img_10_cena-aniversario.jpg" 
            alt="Cena aniversario" 
            align="left" 
            width="w-full sm:w-[45%]" 
          />
          {/* Subtítulo Despues */}
          <strong className="text-white text-lg block mb-2 mt-4">Con el apoyo de la gente</strong>
          <p className="mb-3">
            Tras adquirir el terreno se lo nivela, se plantan eucaliptos, se marca la cancha de fútbol y se construye una habitación a la que se le dió múltiples utilidades como salón de reuniones, vestuario, secretaria y guardarropa. Todo hecho con el esfuerzo de personas desinteresadas que salían de su trabajo y relegaban horas de descanso para seguir mejorando la institución sin percibir pago alguno.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= LOS BAILES ================= */}
        <div>
          {/* Subtítulo PRIMERO */}
          <strong className="text-white text-lg block mb-2 mt-4">Los bailes de Barrio Norte</strong>
          
          {/* Imagen LUEGO, a la derecha */}
          <FlatImage 
            src="/historia/img_03_anuncio-baile.jpg" 
            alt="Anuncio de baile" 
            align="right" 
            width="w-full sm:w-[30%]" // <-- Imagen reducida
          />
          <p className="mb-3">
            Una actividad inicial muy importante para la expansión del club fueron los bailes. El primero de ellos se realizó en la pista Bur, pero luego tras desacuerdos económicos, los norteños deciden utilizar sus conocimientos de oficio en albañilería para crear el terreno de la pista de baile que sería frecuentada por bandas y orquestas.
          </p>
        </div>
      </div>
    ),
  },

  {
    id: "1952",
    range: "1952 - 1959",
    title: "El fútbol",
    imageSrc: "/historia/img_07_primer-equipo(inferiores).jpg",
    floatImage: true, // <-- Activamos el layout que permite envolver texto
    /* === CÓDIGO JSX PARA historiaData.js (reemplazar la propiedad content) === */
    content: (
    <div className="space-y-6"> {/* Usamos un div contenedor para mejor flujo */}
      <div>
        <strong className="text-white text-lg block mb-2">Afiliación</strong>
        <p className="mb-3">
          En el año 1952 Barrio Norte se afilia a la Liga Departamental de
          Fútbol de Gualeguay, presentando equipos de divisiones inferiores
          (segunda, cuarta y quinta), los primeros partidos se disputan contra Gualeguay Central en el estadio de Sociedad Sportiva.
        </p>
      
        {/* 1. Ponemos la imagen del debut alineada a la izquierda */}
        <FlatImage 
          src="/historia/img_04_anuncio-debut.jpg" 
          alt="Anuncio del debut de Barrio Norte" 
          align="left" 
          width="w-full sm:w-[45%]" 
        />
        {/* (Nota: Podés ajustar el ancho porcentual a tu gusto) */}
      
        {/* =========================================================================
            SOLUCIÓN CONCRETA A TU PREGUNTA 1: ¿Cómo hacer que empiece debajo?
            Ponemos una "pared" para cortar el efecto de float de la imagen anterior.
            Esto obliga a todo lo que viene después a empezar por debajo.
            ========================================================================= */}
        <div className="clear-both" /> 
        
        <strong className="text-white text-lg block mb-2 mt-4">Primer plantel de primera</strong>
        
        {/* =========================================================================
            SOLUCIÓN CONCRETA A TU PREGUNTA 2: ¿Cómo poner otra imagen al lado?
            Insertamos la NUEVA imagen secundaria alineada a la derecha. 
            Aparecerá a la derecha de los párrafos que siguen.
            ========================================================================= */}
        <FlatImage 
          src="/historia/img_06_primer-equipo(otra-foto).jpg"  // <- REEMPLAZÁ POR LA RUTA DE TU OTRA FOTO
          alt="Foto del primer plantel de 1955" 
          align="right" 
          width="w-full sm:w-1/3" 
        />
  
        <p className="mb-3">
          Recién hacia el año 1955 se logra formar una primera división que
          represente al club. Dirigidos por Adán Lezcano y Ricardo "Toto"
          Benítez como ayudante, el equipo se conformó por: Gómez, Olivera,
          Denardi, Rógora, Cánepa, Amarillo, Bur, Tassistro, Piaggio, Recalde
          y Reynoso.
        </p>
        {/* (Nota: He corregido la ortografía de 'Recalde', tal como me indicaste
            que no cambiara la información del texto pero sí la posición). */}
        
        <p className="mb-3">
          En este mismo año, la Municipalidad de Gualeguay le otorga la
          personería jurídica al Club Atlético Barrio Norte. Para este tiempo, el club sigue
          creciendo de a poco en su zona de influencia, siempre con la ayuda
          de los vecinos que acudían sus eventos y disciplinas.
        </p>
        
        {/* Limpiamos el float interno por las dudas antes de pasar al otro bloque */}
        <div className="clear-both" /> 
      </div>
        
      <div>
        <strong className="text-white text-lg block mb-2">Cómo era Barrio Norte</strong>
        
        {/* =========================================================================
            SOLUCIÓN CONCRETA A TU PREGUNTA 3: ¿Cómo hacerlo en "Como era Barrio Norte"?
            Hacemos lo mismo: ponemos la tercera imagen alineada a la derecha.
            Aparecerá a la derecha del párrafo que sigue.
            ========================================================================= */}
        <FlatImage 
          src="/historia/foto_00.jpg" // <- REEMPLAZÁ POR LA RUTA DE TU TERCERA FOTO
          alt="Detalle de las camisetas con tucos" 
          align="right" 
          width="w-full sm:w-1/4" 
        />
  
        <p className="mb-3">
          Las camisetas en esta década eran de mangas a rayas,
          fabricadas por la agrupación de damas del club, que tenían los
          llamados "tucos", una especie de abrojo que se sacaba para lavar la
          indumentaria.
        </p>
        <p>
          Estos detalles, caracterizaban el día a día, la supervivencia. Lejos
          estaban las pretenciones deportivas, que se podían presentar en
          otras instituciones que ya tenían 40 años de historia, que poseían mayor poder
          adquisitivo y político. Por lo que durante esta década y la
          posterior Barrio Norte oscila entre la Primera "A" y la Primera "B"
          de la Liga Departamental de Gualeguay.
        </p>
      </div>
    </div>
    ),
  },

  {
    id: "1960",
    range: "1960 - 1969",
    title: "Nuevos Horizontes",
    imageSrc: "/historia/foto_02.jpg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= EXPANSIÓN ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Expansión</strong>
          
          {/* Cuando quieras agregar una foto, poné tu <FlatImage /> acá */}
          
          <p className="mb-3">
            Durante estos años, Barrio Norte busca abrirse paso en diferentes
            actividades. Para ello se realizan rifas con el fin de comprar
            arena, ladrillos y cemento para la construcción del salón de
            eventos. En paralelo, la Municipalidad le otorga la titularidad del
            terreno al club y cede la parte delantera del predio para que se
            construyan viviendas en el barrio.
          </p>
          <p className="mb-3">
            Comienza a haber representación en pesca hacia 1962, con su
            respectiva subcomisión, para luego en 1963 sumarse la famosa y
            popular actividad de las bochas, que aún a nuestros días se mantiene como un pilar en el club.
          </p>
        </div>

        <div className="clear-both" />
        <FlatImage 
          src="/historia/img_12_bochas.png" 
          alt="Bochas en Barrio Norte" 
          align="right" 
          width="w-full sm:w-[15%]" // <-- ACÁ ESTÁ EL CAMBIO (bajamos a 15%)
        />
        {/* ================= OBRAS ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Obras</strong>
          
          {/* O poné tu <FlatImage /> acá */}
          
          <p className="mb-3">
            Hacia 1968 tras una importante inversión, se logra finalizar el salón con la
            colocación de su techo, el mismo es inaugurado con una gran fiesta.
          </p>
          <p className="mb-3">
            El deporte de las bochas, realmente popular en la época, reúne varias personas a disputar sus
            encuentros en las canchas de tierra por lo que se plantea desde el club crear a futuro
            una cancha en mejores condiciones.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "1970",
    range: "1970 - 1979",
    title: "Afianzamiento",
    imageSrc: "/historia/img_08_campeones-1974(bien).png",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= SIGUE LA EXPANSIÓN ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Sigue la expansión</strong>
          <p className="mb-3">
            En 1971 se empieza a construir la cancha de bochas, al lado del
            salón (a día de hoy se mantiene en uso).
          </p>
          <p className="mb-3">
            El Sr. Juan Larrateguy comienza este mismo año con la enseñanza de
            básquet, con pequeños grupos que al tiempo ganan notoriedad. La
            pista de baile original tiene un uso más mixto en este momento, y es en este lugar donde se concurren los partidos de básquet, los bailes y las reuniones sociales.
          </p>
          <p className="mb-3">
            Barrio Norte se destacará luego en la rama femenina de este deporte,
            que había arrancado justamente hace pocos años, en comparación al
            masculino que ya estaba muy desarrollado en otras instituciones como BH
            y Sportiva.
          </p>
        </div>

        <div className="clear-both" />

        <FlatImage 
          src="/historia/img_13_belloto.jpg" 
          alt="Bochas en Barrio Norte" 
          align="left" 
          width="w-full sm:w-[25%]" // <-- ACÁ ESTÁ EL CAMBIO (bajamos a 15%)
        />
        {/* ================= BICAMPEONATO ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Destacados</strong>
          <p className="mb-3">
            En el año 1974, con Pocha Badaracco a la cabeza, Barrio Norte
            obtiene el Campeonato de Preparación, en ese momento de la Primera
            "B". Este título se repite para el siguiente año 1975 con el mismo
            cuerpo técnico al mando.
          </p>
          <p className="mb-3">
            Los torneos de básquet femenino a mediados de los 70s solían tener a Barrio Norte como protagonista, con jugadoras como las hermanas Belloto y "Pinky" Aranda, incluso Adriana Belloto llegó a participar en la selección entrerriana dentro de un campeonato nacional.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "1980",
    range: "1980 - 1989",
    title: "Años 80s",
    imageSrc: "/historia/img_14_corso.jpg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= SUCESOS ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Sucesos</strong>
          <p className="mb-3">
            Esta década se caracteriza porque es aquí cuando Barrio Norte comienza a  participar de los
            carnavales realizados en la calle San Antonio Norte, precedentes de lo que es hoy en día el Carnaval de Gualeguay.
          </p>
          <p className="mb-3">
            Para 1983 se construye una cancha de baby iluminada y al siguiente
            año se colocan tribunas de hormigón en la cancha de fútbol y como
            siempre, todo realizado con el apoyo de las personas del club que buscaban mejorar la infraestructura para luego disfrutarla.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= ÁMBITO FUTBOLÍSTICO ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Ámbito futbolístico</strong>
          
          {/* IMAGEN ALINEADA A LA DERECHA */}
          <FlatImage 
            src="/historia/foto_07.jpg" // <- REEMPLAZÁ POR LA RUTA DE TU FOTO
            alt="Fútbol en los 80s" 
            align="right" 
            width="w-full sm:w-[35%]" // <- Ajustá el porcentaje según necesites
          />

          <p className="mb-3">
            El club andaba en zonas medias-bajas de la tabla, por lo que desde
            la subcomisión de fútbol se decide cambiar la mentalidad, imponer
            una manera de trabajo con bases en la constancia, seriedad y
            entrenamiento.
          </p>
          <p className="mb-3">
            Esto da sus frutos porque a medida que se avanza en la década van
            mejorando los jugadores, tanto los propios como los que se acercan
            por primera vez, hasta el subcampeonato de 1989, donde se pierde por
            1 punto el título que obtiene finalmente El Progreso, estos sucesos
            marcan la fórmula que dará grandes frutos en los siguientes años.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "1990",
    range: "1990 - 1995",
    title: "Primer Campeonato",
    imageSrc: "/historia/img_09_primer-campeonato.jpg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= AL MANDO DE RUBITO ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Al mando de Rubito</strong>

          <p className="mb-3">
            El primer campeonato oficial se obtuvo en el año 1990, bajo la
            conducción de Rubén Garibotti, el mismo que fuese vecino,
            jugador, técnico, campeón y hasta presidente de la institución. Esto marca un
            antes y un después ya que mostró el correcto camino a seguir, y
            propiamente un hito, a 40 años de la fundación el primer título
            oficial.
          </p>
          <FlatImage 
            src="/historia/img_16_techo.png" // <- REEMPLAZÁ POR LA RUTA DE TU FOTO
            alt="Fútbol en los 80s" 
            align="left" 
            width="w-full sm:w-[35%]" // <- Ajustá el porcentaje según necesites
          />
          <p className="mb-3">
            En el año 1992 se logra finalizar el techo parabólico emergido sobre
            la antigua pista de baile, y como se mencionó también devenida a la
            utilización en diferentes disciplinas.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "1995",
    range: "1995 - 1997",
    title: "La aventura nacional",
    imageSrc: "/historia/img_17_campeon_1995.jpg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= LA CAMPAÑA ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">La campaña</strong>
          <p className="mb-3">
            Hacia el año 1995, el plantel de Barrio Norte liderado por Mario
            Raúl Correa y su ayudante Antonio Reynoso se consagra campeón
            invicto de la Liga Departamental, obteniendo así el derecho de
            participar del Torneo Argentino "B".
          </p>
          <p className="mb-3">
            Este torneo era un salto gigantesco para la institución, en lo
            deportivo, lo edilicio y lo económico. Sobran las anécdotas de
            quienes participaran de aquella campaña donde dirigentes dormían en
            el piso de los hoteles, las comidas eran preparadas por las damas
            del club y las hazañas se iban cumpliendo a medida que avanzaba el
            tiempo.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= RESULTADOS ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Resultados</strong>
          
          {/* IMAGEN ALINEADA A LA DERECHA */}
          <FlatImage 
            src="/historia/foto_05.jpg" // <- REEMPLAZÁ POR LA RUTA DE TU FOTO
            alt="Resultados del Torneo Argentino B" 
            align="right" 
            width="w-full sm:w-[50%]" // <- Ajustá el porcentaje según necesites
          />

          <p className="mb-3">
            Se traen refuerzos de Rosario, Paraná, Corrientes y Buenos Aires, en
            conjunto con jugadores de toda la vida como el "Colo" Sánchez, que
            era el capitán. La primer mitad del torneo dirige Correa y Reynoso
            para luego darle paso a Rubén Garibotti y Jesús Gómez.
          </p>
          <p className="mb-3">
            El esfuerzo dió sus frutos ya que fue la mejor campaña nacional de
            la historia de un equipo gualeyo, se llegó a semifinales donde
            sale vencedor Brown de Arrecifes, quien fuera el equipo que ascendiera
            al Torneo Argentino "A" y posteriormente al Nacional "B". Sin dudas
            este es un gran recuerdo que a todos llena de orgullo.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "1998",
    range: "1998 - 2004",
    title: "La época dorada",
    imageSrc: "/historia/foto_11.jpg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= LOS AÑOS MÁS GANADORES ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Los años más ganadores</strong>
          <p className="mb-3">
            El club participa nuevamente en el Torneo Argentino "B" de la
            temporada 1997, donde cae eliminado en la segunda ronda. Para 1998
            asume como DT Nicolino Rafael Nosiglia, quien el torneo anterior
            fuera ayudante de campo de Héctor "El Gallego" Caminos.
          </p>
          <p className="mb-3">
            Nosiglia se destaca en la historia por ser el técnico más ganador
            de la historia del club. Para el año 1999 Barrio Norte se consagra
            campeón de uno de los dos torneos que se juegan ese año, en un
            formato Apertura y Clausura similar al que se utilizaba en esos
            años en las máximas categorías del fútbol argentino.
          </p>
          <p className="mb-3">
            En el año 2001 se obtiene nuevamente el campeonato local, además de
            un torneo nocturno jugado en la ciudad de Victoria y la Copa Mateo
            Martínez, pero esta no sería la mayor alegría del año.
          </p>
        </div>

        {/* Acá sí limpiamos porque termina la primera sección */}
        <div className="clear-both" /> 

        {/* ================= EL REGIONALITO Y LA ESTRELLA ================= */}
        <div>
          {/* IMAGEN COMPARTIDA PARA LOS DOS SUBTÍTULOS */}
          <FlatImage 
            src="/historia/foto_09.jpeg" // <- REEMPLAZÁ POR TU FOTO
            alt="Campeones Regionalito y Departamental" 
            align="left" 
            width="w-full sm:w-[45%]" 
          />

          <strong className="text-white text-lg block mb-2 mt-4">El Regionalito</strong>
          <p className="mb-3">
            Bajo esta denominación se conocía al actual campeonato de Copa Entre
            Ríos, allí se enfrentaban los mejores de cada liga peleando por una
            plaza para competir en el Torneo Argentino "B".
          </p>
          <p className="mb-3">
            Se cierra con broche de oro este año cuando en la final ante
            Juventud de Caseros, Barrio Norte se impone y gana su primer
            campeonato provincial, el único hasta la fecha.
          </p>

          {/* NO PONEMOS CLEAR-BOTH ACÁ PARA QUE LA IMAGEN SIGA FLOTANDO */}

          <strong className="text-white text-lg block mb-2 mt-6">Otro título</strong>
          <p className="mb-3">
            En el año 2004 Barrio Norte se consagra campeón de la Liga
            Departamental, durante el torneo estuvieron a cargo "El Gallego"
            Caminos y luego Raúl Forti. El capitán y goleador era Mariano
            Vecchio, quien convirtiera el gol en la final para ganar el título.
          </p>
        </div>

        {/* Limpiamos al final de todo el bloque */}
        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "2005",
    range: "2005 - 2009",
    title: "El color de Barrio Norte",
    imageSrc: "/historia/img_20_corso.png",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= COMIENZO ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Comienzo</strong>
          
          {/* Si querés agregar foto de Samba Verá, poné el <FlatImage /> acá */}

          <p className="mb-3">
            La plaza para el Carnaval de Gualeguay es adquirida a Libertad en el
            año 2005, y al siguiente año se crea oficialmente la comparsa Samba
            Verá, representando a Barrio Norte. La primer directora fue Alba
            Repetto y luego han estado nombres como Norma Senize, José Luis
            Galarza y Walter Testa.
          </p>
          <p className="mb-3">
            A lo largo de la historia, se han levantado un total de 6
            campeonatos, donde siempre Samba Verá ha destacado por sus grandes
            bandas, músicos, percusionistas, bailarines, animadores, modistas,
            pasistas e integrantes.
          </p>
          <p className="mb-3">
            Cada año, se involucran miles de personas desde la confección de
            carrozas y vestidos, puesta en escena de conceptos y bandas sonoras,
            hasta los servicios de catering y cantina que se pueden prestar,
            todo con norteños que se ponen a la institución en la espalda, como
            la historia ha marcado.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= GIMNASIA RÍTMICA ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Gimnasia Rítmica</strong>
          
          <FlatImage 
            src="/historia/img_19_ritmica.jpg" // <- REEMPLAZÁ POR TU FOTO
            alt="Campeones Regionalito y Departamental" 
            align="right" 
            width="w-full sm:w-[35%]" 
          />

          <p className="mb-3">
            La Escuela de Gimnasia Rítmica de Barrio Norte nace en 2006 a cargo
            de Alejandra Zeballos, que aún hoy en día está al frente del
            proyecto.
          </p>
          <p className="mb-3">
            Hacia 2009 Barrio Norte se adhiere a la Federación Entrerriana de
            Gimnasia, y desde 2010 participa de Torneos Nacionales Federativos.
            Es muy valioso el semillero que aglomera alrededor de 60 gimnastas.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "2010",
    range: "2010 - 2011",
    title: "La catástrofe",
    imageSrc: "/historia/img_18_catastrofe.png",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= EL DOLOR DE LA DESTRUCCIÓN ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">El dolor de la destrucción</strong>
          
          {/* Si querés agregar alguna foto de los daños, poné el <FlatImage /> acá */}

          <p className="mb-3">
            El 12 de enero de 2010, una cola de tornado con vientos de hasta 100
            km/h golpea la zona norte de la ciudad, dejando la infraestructura
            del club muy anegada. Techos volados, tribunas rotas, carrozas
            destrozadas a días del comienzo del carnaval, marcaron un caótico
            inicio de año.
          </p>
          <p className="mb-3">
            Con ayuda de los vecinos de la ciudad, el gobierno municipal y
            provincial, el club se logra recuperar de los daños materiales a los
            pocos años del evento.
          </p>
        </div>

        <div className="clear-both" />

      </div>
    ),
  },

  {
    id: "2012",
    range: "2012 - 2021",
    title: "Nuevos desafíos",
    imageSrc: "/historia/img_22_tenis.jpg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= TENIS ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Tenis</strong>
          <p className="mb-3">
            En el año 2012 durante la presidencia de Miguel Cosso se comenzó con
            el dictado de clases de tenis para niños, adolescentes y adultos
            bajo la tutela del profesor José Samuel. Ese año Barrio Norte se
            afilia a la Federación Entrerriana de Tenis, la cancha utilizada era
            la vieja pista de baile reacondicionada para el deporte. Hoy en día
            Barrio Norte cuenta con 2 canchas de polvo de ladrillo para la
            práctica del deporte.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= COPA ENTRE RÍOS ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Copa Entre Ríos</strong>
          
          {/* IMAGEN ALINEADA A LA DERECHA */}
          <FlatImage 
            src="/historia/img_21_copa-entre-rios-2017.jpg" // <- REEMPLAZÁ POR TU FOTO
            alt="Subcampeonato Copa Entre Ríos 2017" 
            align="right" 
            width="w-full sm:w-[45%]" // <- Ajustá el porcentaje según necesites
          />

          <p className="mb-3">
            En 2017, la primer edición oficial de la nueva Copa Entre Ríos,
            antes llamada Regionalito, Barrio Norte sale subcampeón tras perder
            una final donde se había remontado un 3 a 0 abajo inicial, pero
            finalmente se pierde por penales ante San José Obrero de Mocoretá.
          </p>
          <strong className="text-white text-lg block mb-2 mt-4">Pandemia</strong>
          <p className="mb-3">
            La pandemia de Covid-19 afecta al mundo en el año 2020 lo que relega
            al club a permanecer cerrado y tarda más de un año y medio en
            volverse a introducir al normal funcionamiento. Estos años de
            aislamiento afianzan la venta de la rifa de una casa que realiza el
            club anualmente, una fuente considerable del presupuesto anual.
          </p>
        </div>

        <div className="clear-both" />


      </div>
    ),
  },

  {
    id: "2022",
    range: "2022 - 2026",
    title: "Grandes Conquistas",
    imageSrc: "/historia/foto_10.jpeg",
    floatImage: true,
    content: (
      <div className="space-y-6">
        
        {/* ================= BICAMPEONATO ================= */}
        <div>
          <strong className="text-white text-lg block mb-2">Bicampeonato</strong>
          <p className="mb-3">
            Después de 18 años sin títulos en el fútbol, Barrio Norte finalmente sale
            campeón ante Urquiza en cancha de Bancario, de lo que sería el
            Campeonato Oficial 2021/22, el primero realizado post-pandemia dentro de lo que sería el comienzo de unos fructíferos años para el club en lo deportivo.
          </p>
          <p className="mb-3">
            El torneo siguiente, el Oficial 2022 también queda en las vitrinas de Barrio Norte tras vencen en otra
            final a Urquiza en lo que fue una serie ida y vuelta muy recordada, marcando récords de asistencia a los estadios en la ciudad.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= OTRA VEZ BICAMPEÓN ================= */}
        <div>
          <strong className="text-white text-lg block mb-2 mt-4">Otra vez bicampeón</strong>
          
          {/* IMAGEN ALINEADA A LA IZQUIERDA */}
          <FlatImage 
            src="/historia/img_23_campeon24.jpg" // <- REEMPLAZÁ POR TU FOTO
            alt="Bicampeón 2024" 
            align="left" 
            width="w-full sm:w-[35%]" // <- Ajustá el porcentaje según necesites
          />

          <p className="mb-3">
            En 2024 se repite la hazaña con el "Beto" García con la obtención del
            Torneo Preparación y el Oficial, siendo este último evidencia de una de las definiciones más épicas de esta época del fútbol gualeyo de principio a fin.
          </p>
        </div>

        <div className="clear-both" />

        {/* ================= NUESTROS DÍAS (CIERRE DESTACADO) ================= */}
        {/* Contenedor especial centrado, con bordes suaves, fondo oscuro y un leve resplandor rojo */}
        <div className="mt-16 mb-8 p-8 md:p-12 text-center bg-gradient-to-b from-neutral-900/40 to-neutral-900/80 border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden group">
          
          {/* Luz de fondo decorativa */}
          <div className="absolute inset-0 bg-red-600/5 blur-[80px] pointer-events-none" />

          {/* Subtítulo destacado */}
          <strong className="relative text-red-500 text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] block mb-6">
            Nuestros días
          </strong>

          {/* Texto principal en cursiva y más grande */}
          <p className="relative text-[16px] sm:text-[18px] md:text-[20px] text-neutral-300 font-light leading-relaxed max-w-3xl mx-auto italic">
            "La historia se sigue escribiendo y lo está haciendo como nuestra
            historia marca, con los norteños poniendo alma y cuerpo con el único
            objetivo de que Barrio Norte siga creciendo como club, para darle
            más espacios, mejores herramientas a los propios y un prestigio que
            se rige en los valores de la honestidad, el trabajo y el compromiso."
          </p>

          {/* Pequeña línea roja decorativa al final */}
          <div className="relative h-[2px] w-12 bg-red-600 mx-auto mt-8 rounded-full opacity-70" />
        </div>

        <div className="clear-both" />

      </div>
    ),
  },
];