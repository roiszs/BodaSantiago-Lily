"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  MapPin,
  Music2,
  Pause,
  Play,
  Shirt,
  Sparkles,
  Users,
  X,
} from "lucide-react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

type RSVPState = {
  name: string;
  lastName: string;
  comment: string;
};

function buildGoogleCalendarUrl({
  title,
  details,
  location,
  start,
  end,
}: {
  title: string;
  details: string;
  location: string;
  start: string;
  end: string;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details,
    location,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsFile({
  title,
  description,
  location,
  start,
  end,
}: {
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
}) {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//ES
BEGIN:VEVENT
UID:wedding-lily-santiago@invite
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
}

function downloadIcs(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function InvitationImage({
  src,
  alt,
  tall = false,
}: {
  src: string;
  alt: string;
  tall?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 ${
        tall ? "h-80" : "h-56"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 420px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/55">
        {icon}
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm leading-6 text-white/70">{subtitle}</p>
      ) : null}
    </div>
  );
}

function HeroStackedCarousel({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrev = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  const visibleCards = [0, 1, 2].map((offset) => {
    const image = images[(activeIndex + offset) % images.length];
    return { ...image, offset };
  });

  return (
    <div className="relative mx-auto h-[25rem] w-full max-w-sm">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8c3a5]/15 blur-3xl" />

      {visibleCards
        .slice()
        .reverse()
        .map((card) => {
          const styles =
            card.offset === 0
              ? "translate-y-0 rotate-0 scale-100 opacity-100 z-30"
              : card.offset === 1
              ? "translate-y-4 rotate-[4deg] scale-[0.95] opacity-70 z-20"
              : "translate-y-8 -rotate-[4deg] scale-[0.9] opacity-45 z-10";

          return (
            <div
              key={`${card.src}-${card.offset}-${activeIndex}`}
              className={`absolute inset-x-0 top-0 mx-auto h-[23rem] w-[92%] overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_25px_90px_rgba(0,0,0,0.38)] transition-all duration-700 ease-out ${styles}`}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
                priority={card.offset === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          );
        })}

      <div className="absolute bottom-0 left-1/2 z-40 flex w-[92%] -translate-x-1/2 items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-xl">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="h-1 w-1 rounded-full bg-white/45" />
          <span>{String(images.length).padStart(2, "0")}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-xl"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-xl"
            aria-label="Siguiente foto"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="absolute -bottom-12 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-[#d8c3a5]" : "w-2.5 bg-white/35"
            }`}
            aria-label={`Ir a foto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function WeddingInvitationMobile() {
  const wedding = {
    bride: "Lily",
    groom: "Santiago",
    dateLabel: "10 de Octubre de 2026",
    ceremonyTimeLabel: "9:00 PM",
    countdownTarget: "2026-10-10T21:00:00-06:00",
    venue: "Palazzio",
    address:
      "Av. Prof. R. Rivera Lara 6031, Parques Industriales, 32625 Juárez, Chih.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Palazzio, Av. Prof. R. Rivera Lara 6031, Parques Industriales, 32625 Juárez, Chihuahua"
      ),
    galleryClosingQuote:
      "Gracias por acompañarnos a escribir el primer capítulo de esta nueva historia juntos.",
    introText:
      'Te invitamos a ser parte de este día tan especial mientras celebramos el amor, la unión y el inicio de nuestro "Felices para siempre", rodeados de las personas que más significan para nosotros.',
    moneyBoxText:
      "Lo más valioso para nosotros es compartir este día contigo. Si deseas contribuir a nuestro nuevo comienzo, ese día contaremos con buzón de dinero.",
    weddingWhatsapp: "+526560000000",
    tornabodaWhatsapp: "+526560000000",
    tornabodaLocation: "Samalayuca",
    tornabodaAddress: "Galeana, 32730 Samalayuca, Chih.",
    tornabodaMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Galeana, 32730 Samalayuca, Chihuahua"),
    tornabodaTime: "12:00 PM",
    songSrc: "/music/boda.mp3",
  };

  const womenPalette = [
    { name: "Negro", hex: "#0A0A0A" },
    { name: "Grafito", hex: "#242428" },
    { name: "Marengo", hex: "#575759" },
    { name: "Ébano", hex: "#4A3E31" },
    { name: "Café negro", hex: "#2B0B00" },
    { name: "Chocolate", hex: "#3A1808" },
    { name: "Castaño", hex: "#6A3620" },
    { name: "Óxido", hex: "#7A2417" },
    { name: "Ciruela", hex: "#4C1F3D" },
    { name: "Morado", hex: "#4A0352" },
    { name: "Berenjena", hex: "#250022" },
    { name: "Uva", hex: "#26153E" },
    { name: "Arándano", hex: "#323859" },
    { name: "Azul noche", hex: "#020A4B" },
    { name: "Azul marino", hex: "#01245E" },
    { name: "Petróleo", hex: "#003A44" },
    { name: "Verde inglés", hex: "#004B2B" },
    { name: "Verde bosque", hex: "#19382D" },
  ];

  const dressRules = [
    "Mujeres: evitar rojo y blanco.",
    "Hombres: look formal o vaquero con traje.",
    "Sí se permiten botas y sombrero si el outfit mantiene el estilo elegante.",
    "No mezclilla.",
    "No tenis.",
  ];

  const ideas = [
    {
      text: "Vestido satinado midi en tonos oscuros con caída elegante.",
      src: "/invitacion/mujer-vestido1.jpeg",
    },
    {
      text: "Vestido largo en tonos profundos y sobrios para una presencia más refinada.",
      src: "/invitacion/mujer-vestido2.jpeg",
    },
    {
      text: "Traje formal oscuro con camisa limpia para un look clásico y elegante.",
      src: "/invitacion/hombre-opcion.jpeg",
    },
    {
      text: "Opción vaquera formal con saco estructurado, botas y accesorios sobrios.",
      src: "/invitacion/hombre-opcionVaquero.jpeg",
    },
  ];

  const heroGallery = [
    {
      src: "/invitacion/fotoPrincipal.jpeg",
      alt: "Foto principal de Lily y Santiago",
    },
    {
      src: "/invitacion/fotoSecundaria.jpeg",
      alt: "Foto romántica de Lily y Santiago",
    },
    {
      src: "/invitacion/foto1.jpeg",
      alt: "Foto de sesión de Lily y Santiago 1",
    },
    {
      src: "/invitacion/foto2.jpeg",
      alt: "Foto de sesión de Lily y Santiago 2",
    },
  ];

  const sessionGallery = [
    "Foto sesión 1",
    "Foto sesión 2",
    "Foto sesión 3",
    "Foto sesión 4",
  ];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

  const [showDressIdeas, setShowDressIdeas] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [weddingRsvp, setWeddingRsvp] = useState<RSVPState>({
    name: "",
    lastName: "",
    comment: "",
  });

  const [afterRsvp, setAfterRsvp] = useState<RSVPState>({
    name: "",
    lastName: "",
    comment: "",
  });

  const weddingCalendarData = useMemo(() => {
    const start = "20261011T030000Z";
    const end = "20261011T090000Z";
    const title = "Boda de Lily y Santiago";
    const details = "Acompáñanos a celebrar nuestra boda.";
    const location = `${wedding.venue}, ${wedding.address}`;

    return {
      google: buildGoogleCalendarUrl({
        title,
        details,
        location,
        start,
        end,
      }),
      ics: buildIcsFile({
        title,
        description: details,
        location,
        start,
        end,
      }),
    };
  }, [wedding.address, wedding.venue]);

  useEffect(() => {
    const target = new Date(wedding.countdownTarget).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          ended: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, ended: false });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [wedding.countdownTarget]);

  useEffect(() => {
    const audio = document.getElementById(
      "wedding-audio"
    ) as HTMLAudioElement | null;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const weddingMessage = `Hola, confirmo mi asistencia a la boda.%0A%0ANombre: ${encodeURIComponent(
    weddingRsvp.name || ""
  )}%0AApellido: ${encodeURIComponent(
    weddingRsvp.lastName || ""
  )}%0AComentario: ${encodeURIComponent(weddingRsvp.comment || "")}`;

  const afterMessage = `Hola, confirmo mi asistencia a la tornaboda.%0A%0ANombre: ${encodeURIComponent(
    afterRsvp.name || ""
  )}%0AApellido: ${encodeURIComponent(
    afterRsvp.lastName || ""
  )}%0AComentario: ${encodeURIComponent(afterRsvp.comment || "")}`;

  const card =
    "rounded-[30px] border border-white/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl";

  const input =
    "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d8c3a5]/50";

  return (
    <main className="min-h-screen bg-[#141114] text-white">
      <audio id="wedding-audio" loop preload="none" src={wedding.songSrc} />

      <div className="fixed inset-x-0 top-0 z-40 mx-auto flex w-full max-w-md items-center justify-end px-4 pt-4">
        <button
          type="button"
          onClick={() => setIsPlaying((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-medium text-white/85 backdrop-blur-xl"
        >
          <Music2 size={14} />
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? "Pausar música" : "Reproducir música"}</span>
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-md px-4 pb-12 pt-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d8c3a5]/12 blur-3xl" />
          <div className="absolute right-0 top-[28rem] h-56 w-56 rounded-full bg-[#b89b84]/10 blur-3xl" />
          <div className="absolute bottom-20 left-0 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        </div>

        <section className="relative pt-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.38em] text-white/50">
            Nuestra boda
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#f7f1eb]">
            {wedding.bride}
            <span className="mx-auto my-2 block text-2xl font-light text-[#d8c3a5]">
              &
            </span>
            {wedding.groom}
          </h1>

          <div className="mt-8">
            <HeroStackedCarousel images={heroGallery} />
          </div>

          <div className="mt-20 rounded-[30px] border border-white/10 bg-white/6 px-5 py-6 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-2 text-[#d8c3a5]">
              <Heart size={15} />
              <span className="text-[11px] uppercase tracking-[0.28em]">
                Estás invitado a nuestra boda
              </span>
            </div>

            <p className="mt-4 text-2xl font-medium text-white">
              {wedding.dateLabel}
            </p>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-white/72">
              {wedding.introText}
            </p>
          </div>
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Cuenta regresiva"
            title="Falta muy poco para el gran día"
            subtitle={
              timeLeft.ended
                ? "Hoy celebramos juntos."
                : "Nos emociona compartir este momento contigo."
            }
            icon={<Sparkles size={13} />}
          />

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Días", value: pad(timeLeft.days) },
              { label: "Horas", value: pad(timeLeft.hours) },
              { label: "Min", value: pad(timeLeft.minutes) },
              { label: "Seg", value: pad(timeLeft.seconds) },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-h-[108px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/20 px-1 py-4"
              >
                <div className="text-[2rem] font-semibold leading-none text-[#f7f1eb]">
                  {item.value}
                </div>
                <div className="mt-3 whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-white/45">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mt-5">
          <InvitationImage
            src="/invitacion/fotoSecundaria.jpeg"
            alt="Foto secundaria de Lily y Santiago"
          />
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Hora"
            title={wedding.ceremonyTimeLabel}
            subtitle="Guárdalo en tu calendario para que no se te pase ningún detalle."
            icon={<Clock3 size={13} />}
          />

          <div className="grid gap-3">
            <a
              href={weddingCalendarData.google}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f7f1eb] px-4 py-3 text-sm font-semibold text-[#141114]"
            >
              <CalendarDays size={16} />
              Agregar a Google Calendar
            </a>

            <button
              type="button"
              onClick={() =>
                downloadIcs("boda-lily-santiago.ics", weddingCalendarData.ics)
              }
              className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-medium text-white"
            >
              Guardar en mi calendario
            </button>
          </div>
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Ubicación"
            title={wedding.venue}
            subtitle={wedding.address}
            icon={<MapPin size={13} />}
          />

          <div className="space-y-4">
            <InvitationImage
              src="/invitacion/fotoSalon.jpeg"
              alt="Foto exterior del salón Palazzio"
            />

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/15">
              <iframe
                title="Mapa del salón"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${wedding.venue}, ${wedding.address}`
                )}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
              />
            </div>

            <a
              href={wedding.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d8c3a5] px-4 py-3 text-sm font-semibold text-[#141114]"
            >
              <MapPin size={16} />
              Abrir ubicación en Maps
            </a>
          </div>
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Dress code"
            title="Elegante clásico con toque minimalista"
            subtitle="Queremos que te sientas increíble y en armonía con la celebración."
            icon={<Shirt size={13} />}
          />

          <div className="rounded-[26px] border border-white/10 bg-black/15 p-4">
            <p className="text-sm font-medium text-white">
              Tonos sugeridos para vestidos
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {womenPalette.map((tone) => (
                <div
                  key={tone.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <div
                    className="mx-auto h-12 w-12 rounded-full border border-white/15"
                    style={{ backgroundColor: tone.hex }}
                  />
                  <p className="mt-2 text-[11px] leading-4 text-white/70">
                    {tone.name}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-white/70">No rojo · No blanco</p>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <InvitationImage
                src="/invitacion/hombre-traje1.webp"
                alt="Referencia de traje formal para hombre"
              />
              <InvitationImage
                src="/invitacion/hombre-vaquero-1.jpg"
                alt="Referencia de traje vaquero formal para hombre"
              />
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/15 p-4">
              <ul className="space-y-2 text-sm leading-6 text-white/74">
                {dressRules.map((rule) => (
                  <li key={rule}>• {rule}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowDressIdeas(true)}
              className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-medium text-white"
            >
              Consultar más ideas
            </button>
          </div>
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Buzón de dinero"
            title="Tu presencia es lo más importante"
            subtitle={wedding.moneyBoxText}
            icon={<Gift size={13} />}
          />

          <InvitationImage
            src="/invitacion/buzonDeDinero.jpg"
            alt="Buzón de dinero"
          />
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Confirmación"
            title="Confirma tu asistencia a la boda"
            subtitle="Completa tus datos y envía tu confirmación."
            icon={<Users size={13} />}
          />

          <div className="space-y-3">
            <input
              className={input}
              placeholder="Nombre"
              value={weddingRsvp.name}
              onChange={(e) =>
                setWeddingRsvp({ ...weddingRsvp, name: e.target.value })
              }
            />
            <input
              className={input}
              placeholder="Apellido"
              value={weddingRsvp.lastName}
              onChange={(e) =>
                setWeddingRsvp({ ...weddingRsvp, lastName: e.target.value })
              }
            />
            <textarea
              className={`${input} min-h-[110px] resize-none`}
              placeholder="Comentario para los novios"
              value={weddingRsvp.comment}
              onChange={(e) =>
                setWeddingRsvp({ ...weddingRsvp, comment: e.target.value })
              }
            />

            <a
              href={`https://wa.me/${wedding.weddingWhatsapp.replace(
                /\D/g,
                ""
              )}?text=${weddingMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#f7f1eb] px-4 py-3 text-sm font-semibold text-[#141114]"
            >
              Confirmo que asistiré
            </a>

            <p className="text-xs leading-5 text-white/55">
              Tu nombre lo agregaremos a la lista para entrega de pases. Favor
              de confirmar por persona, no por familia.
            </p>
          </div>
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Tornaboda"
            title="Y que la celebración continúe..."
            subtitle="Acompáñanos a nuestra tornaboda para seguir compartiendo este momento tan especial juntos."
            icon={<Sparkles size={13} />}
          />

          <div className="rounded-[26px] border border-white/10 bg-black/15 p-4">
            <p className="text-lg font-medium text-white">
              {wedding.tornabodaTime} · {wedding.tornabodaLocation}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Solo lleva tu bebida favorita.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <input
              className={input}
              placeholder="Nombre"
              value={afterRsvp.name}
              onChange={(e) =>
                setAfterRsvp({ ...afterRsvp, name: e.target.value })
              }
            />
            <input
              className={input}
              placeholder="Apellido"
              value={afterRsvp.lastName}
              onChange={(e) =>
                setAfterRsvp({ ...afterRsvp, lastName: e.target.value })
              }
            />
            <textarea
              className={`${input} min-h-[110px] resize-none`}
              placeholder="Comentario para la tornaboda"
              value={afterRsvp.comment}
              onChange={(e) =>
                setAfterRsvp({ ...afterRsvp, comment: e.target.value })
              }
            />

            <a
              href={`https://wa.me/${wedding.tornabodaWhatsapp.replace(
                /\D/g,
                ""
              )}?text=${afterMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#d8c3a5] px-4 py-3 text-sm font-semibold text-[#141114]"
            >
              Confirmar asistencia a la tornaboda
            </a>

            <div className="space-y-4 rounded-[26px] border border-white/10 bg-black/15 p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Ubicación de la tornaboda
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {wedding.tornabodaAddress}
                </p>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/15">
                <iframe
                  title="Mapa de la tornaboda"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    wedding.tornabodaAddress
                  )}&output=embed`}
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>

              <a
                href={wedding.tornabodaMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d8c3a5] px-4 py-3 text-sm font-semibold text-[#141114]"
              >
                <MapPin size={16} />
                Abrir ubicación de la tornaboda
              </a>
            </div>
          </div>
        </section>

        <section className={`relative mt-5 ${card}`}>
          <SectionTitle
            eyebrow="Nuestra sesión"
            title="Un pequeño vistazo de nosotros"
            icon={<Heart size={13} />}
          />

          <div className="grid grid-cols-2 gap-3">
            {sessionGallery.map((item, index) => (
              <InvitationImage
                key={item}
                src={`/invitacion/foto${index + 1}.jpeg`}
                alt={`Foto de sesión ${index + 1} de Lily y Santiago`}
              />
            ))}
          </div>
        </section>

        <footer className="relative px-4 pb-8 pt-8 text-center">
          <p className="text-xl font-medium italic text-[#f7f1eb]">
            {wedding.galleryClosingQuote}
          </p>
        </footer>
      </div>

      {showDressIdeas ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-[34px] border border-white/10 bg-[#171317] p-5 text-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Dress code
                </p>
                <h3 className="mt-1 text-2xl font-semibold">
                  Más ideas de estilo
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowDressIdeas(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {ideas.map((idea) => (
                <div
                  key={idea.text}
                  className="rounded-[26px] border border-white/10 bg-white/5 p-4"
                >
                  <InvitationImage src={idea.src} alt={idea.text} />
                  <p className="mt-3 text-sm leading-6 text-white/74">
                    {idea.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}