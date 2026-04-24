"use client";

import Image from "next/image";
import { Great_Vibes } from "next/font/google";
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

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

type RSVPState = {
  name: string;
  lastName: string;
  comment: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

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

function SectionHeading({
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
    <div className="mb-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#9d8371]">
        {icon ? <span className="opacity-80">{icon}</span> : null}
        <span>{eyebrow}</span>
      </div>

      <h2 className="text-[1.9rem] font-semibold tracking-tight text-[#4d3f36]">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-2 text-sm leading-6 text-[#7c695d]">{subtitle}</p>
      ) : null}
    </div>
  );
}

function ElegantDivider() {
  return (
    <div className="relative mx-auto my-6 flex items-center justify-center">
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d5b79b] to-transparent" />
      <div className="mx-3 h-2 w-2 rounded-full bg-[#d5b79b]" />
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d5b79b] to-transparent" />
    </div>
  );
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
      className={`relative overflow-hidden rounded-[32px] border border-[#eadfd4] bg-white/70 ring-1 ring-white/60 ${
        tall ? "h-80" : "h-56"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 430px"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(92,70,56,0.14),transparent_48%,rgba(255,255,255,0.10))]" />
    </div>
  );
}

function HeroSeal() {
  return (
    <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full border border-[#eadccf] bg-white/88 shadow-[0_14px_35px_rgba(184,154,129,0.16)] ring-1 ring-white/55 backdrop-blur-xl">
      <span
        className={`${greatVibes.className} text-[1.9rem] leading-none text-[#7a5d4b]`}
      >
        L&S
      </span>
      <span className="mt-1 text-[8px] uppercase tracking-[0.26em] text-[#a28673]">
        10 · 10 · 26
      </span>
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
    <div className="relative mx-auto h-[24rem] w-full max-w-sm">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e5cdb9]/35 blur-3xl" />

      {visibleCards
        .slice()
        .reverse()
        .map((card) => {
          const styles =
            card.offset === 0
              ? "translate-y-0 rotate-0 scale-100 opacity-100 z-30"
              : card.offset === 1
              ? "translate-y-4 rotate-[3deg] scale-[0.96] opacity-70 z-20"
              : "translate-y-8 -rotate-[3deg] scale-[0.92] opacity-45 z-10";

          return (
            <div
              key={`${card.src}-${card.offset}-${activeIndex}`}
              className={`absolute inset-x-0 top-0 mx-auto h-[21.8rem] w-[92%] overflow-hidden rounded-[40px] border border-[#eadccf] bg-white/72 shadow-[0_28px_78px_rgba(184,154,129,0.20)] ring-1 ring-white/50 transition-all duration-700 ease-out ${styles}`}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 430px"
                priority={card.offset === 0}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(92,70,56,0.18),transparent_45%,rgba(255,255,255,0.10))]" />
            </div>
          );
        })}

      <div className="absolute bottom-0 left-1/2 z-40 flex w-[92%] -translate-x-1/2 items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#eadccf] bg-white/82 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[#8c7568] shadow-[0_10px_20px_rgba(184,154,129,0.12)] backdrop-blur-xl">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="h-1 w-1 rounded-full bg-[#b8a092]" />
          <span>{String(images.length).padStart(2, "0")}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadccf] bg-white/82 text-[#6d5a4f] shadow-[0_10px_20px_rgba(184,154,129,0.12)] backdrop-blur-xl"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadccf] bg-white/82 text-[#6d5a4f] shadow-[0_10px_20px_rgba(184,154,129,0.12)] backdrop-blur-xl"
            aria-label="Siguiente foto"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="absolute -bottom-11 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-[#c7a78b]" : "w-2.5 bg-[#d9c7b9]"
            }`}
            aria-label={`Ir a foto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function RSVPForm({
  title,
  note,
  state,
  setState,
  buttonLabel,
  href,
}: {
  title: string;
  note: string;
  state: RSVPState;
  setState: (value: RSVPState) => void;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className="rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,250,245,0.60))] px-4 py-4 ring-1 ring-[#eadfd4] shadow-[0_16px_45px_rgba(184,154,129,0.10)]">
      <p className="text-[10px] uppercase tracking-[0.24em] text-[#a08a7c]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#776558]">{note}</p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.24em] text-[#a08a7c]">
            Nombre
          </label>
          <input
            className="mt-2 w-full border-b border-[#ddcbbd] bg-transparent px-0 pb-2.5 pt-1 text-[15px] text-[#4b3d35] outline-none placeholder:text-[#b39e90] focus:border-[#c8a284]"
            placeholder="Escribe tu nombre"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.24em] text-[#a08a7c]">
            Apellido
          </label>
          <input
            className="mt-2 w-full border-b border-[#ddcbbd] bg-transparent px-0 pb-2.5 pt-1 text-[15px] text-[#4b3d35] outline-none placeholder:text-[#b39e90] focus:border-[#c8a284]"
            placeholder="Escribe tu apellido"
            value={state.lastName}
            onChange={(e) => setState({ ...state, lastName: e.target.value })}
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.24em] text-[#a08a7c]">
            Comentario
          </label>
          <textarea
            className="mt-2 min-h-[110px] w-full rounded-[22px] border border-[#eadccf] bg-white/70 p-4 text-[15px] text-[#4b3d35] outline-none placeholder:text-[#b39e90] focus:border-[#c8a284]"
            placeholder="Mensaje para los novios"
            value={state.comment}
            onChange={(e) => setState({ ...state, comment: e.target.value })}
          />
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#c9a98d] px-4 py-3.5 text-sm font-semibold text-[#fffaf6] shadow-[0_14px_30px_rgba(184,154,129,0.20)] transition hover:translate-y-[-1px] hover:bg-[#c29f82] active:translate-y-0"
      >
        {buttonLabel}
      </a>
    </div>
  );
}

export default function WeddingInvitationMobile() {
  const wedding = {
    bride: "Lily",
    groom: "Santiago",
    dateLabel: "10 de Octubre 2026",
    ceremonyTimeLabel: "9:00 PM",
    countdownTarget: "2026-10-10T21:00:00-06:00",
    venue: "Salón Palazzio",
    address:
      "Av. Prof. R. Rivera Lara 6031, Parques Industriales, 32625 Juárez, Chih.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Salón Palazzio, Av. Prof. R. Rivera Lara 6031, Parques Industriales, 32625 Juárez, Chihuahua"
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

  return (
    <main className="min-h-screen bg-[#f8f2ec] text-[#4b3d35]">
      <audio id="wedding-audio" loop preload="none" src={wedding.songSrc} />

      <div className="fixed inset-x-0 top-0 z-40 mx-auto flex w-full max-w-[430px] items-center justify-end px-4 pt-4 pointer-events-none">
        <button
          type="button"
          onClick={() => setIsPlaying((v) => !v)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[#eadccf] bg-white/86 px-3.5 py-2 text-[11px] font-medium text-[#6d5a4f] shadow-[0_10px_30px_rgba(184,154,129,0.12)] backdrop-blur-xl"
        >
          <Music2 size={14} />
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? "Pausar música" : "Reproducir música"}</span>
        </button>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[430px] px-4 pb-12 pt-3">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#fbf7f3_0%,#f9f1ea_40%,#f7eee7_100%)]" />
          <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,rgba(181,152,128,0.18)_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#ead7c4]/45 blur-3xl" />
          <div className="absolute -left-12 top-[16rem] h-80 w-80 rounded-full bg-[#f4e5dc]/58 blur-3xl" />
          <div className="absolute right-[-2rem] top-[22rem] h-72 w-72 rounded-full bg-[#efd8d2]/40 blur-3xl" />
          <div className="absolute left-1/2 top-[50rem] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#f7eee7]/82 blur-3xl" />
          <div className="absolute bottom-24 right-[-4rem] h-72 w-72 rounded-full bg-[#efe2d4]/50 blur-3xl" />
        </div>

        <section className="relative isolate pt-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#a28673]">
            Nuestra boda
          </p>

          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#d7bca6]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d7bca6]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#d7bca6]" />
          </div>

          <div className="mt-4 flex flex-col items-center">
            <h1
              className={`${greatVibes.className} w-full text-center text-[4.9rem] leading-[0.82] tracking-normal text-[#5a463c] drop-shadow-[0_2px_10px_rgba(184,154,129,0.12)]`}
            >
              <span className="block">Lily</span>
              <span className="mx-auto my-1.5 block text-[2.25rem] font-light text-[#c5a489]">
                &
              </span>
              <span className="block">Santiago</span>
            </h1>
          </div>

          <p className="mx-auto mt-4 max-w-[18rem] text-center text-[11px] uppercase tracking-[0.28em] text-[#9f8678]">
            {wedding.dateLabel} · Juárez, Chihuahua
          </p>

          <div className="relative mt-8">
            <div className="absolute right-3 top-3 z-40">
              <HeroSeal />
            </div>

            <HeroStackedCarousel images={heroGallery} />
          </div>

          <div className="mt-12 rounded-[34px] bg-white/72 px-5 py-5 ring-1 ring-[#eadfd4] shadow-[0_18px_55px_rgba(184,154,129,0.15)] backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d7bca6]" />
              <div className="flex items-center gap-2 text-[#b89479]">
                <Heart size={15} />
                <span className="text-[11px] uppercase tracking-[0.28em]">
                  Estás invitado a nuestra boda
                </span>
              </div>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d7bca6]" />
            </div>

            <p className="mt-4 text-2xl font-medium text-[#4b3d35]">
              {wedding.dateLabel}
            </p>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#7b6a60]">
              {wedding.introText}
            </p>
          </div>
        </section>

        <ElegantDivider />

        <section className="mt-4">
          <SectionHeading
            eyebrow="Cuenta regresiva"
            title="Falta muy poco para el gran día"
            subtitle={
              timeLeft.ended
                ? "Hoy celebramos juntos."
                : "Nos emociona compartir este momento contigo."
            }
            icon={<Sparkles size={12} />}
          />

          <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,249,244,0.72))] px-3 py-3 ring-1 ring-[#eadfd4] shadow-[0_18px_50px_rgba(184,154,129,0.12)]">
            <div className="grid grid-cols-4 divide-x divide-[#ead8c8]">
              {[
                { label: "Días", value: pad(timeLeft.days) },
                { label: "Horas", value: pad(timeLeft.hours) },
                { label: "Min", value: pad(timeLeft.minutes) },
                { label: "Seg", value: pad(timeLeft.seconds) },
              ].map((item) => (
                <div key={item.label} className="px-2 py-4 text-center">
                  <div className="text-[2rem] font-semibold leading-none text-[#5a463c]">
                    {item.value}
                  </div>
                  <div className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#9a8478]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-5">
          <InvitationImage
            src="/invitacion/fotoSecundaria.jpeg"
            alt="Foto secundaria de Lily y Santiago"
          />
        </section>

        <section className="mt-5">
          <SectionHeading
            eyebrow="Hora"
            title={wedding.ceremonyTimeLabel}
            subtitle="Guárdalo en tu calendario para que no se te pase ningún detalle."
            icon={<Clock3 size={12} />}
          />

          <div className="grid gap-3">
            <a
              href={weddingCalendarData.google}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#c9a98d] px-4 py-3.5 text-sm font-semibold text-[#fffaf6] shadow-[0_14px_30px_rgba(184,154,129,0.20)] transition hover:translate-y-[-1px] hover:bg-[#c29f82] active:translate-y-0"
            >
              <CalendarDays size={16} />
              Agregar a Google Calendar
            </a>

            <button
              type="button"
              onClick={() =>
                downloadIcs("boda-lily-santiago.ics", weddingCalendarData.ics)
              }
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#eadccf] bg-white/84 px-4 py-3.5 text-sm font-medium text-[#6d5a4f] shadow-[0_10px_22px_rgba(184,154,129,0.10)] transition hover:bg-white"
            >
              Guardar en mi calendario
            </button>
          </div>
        </section>

        <ElegantDivider />

        <section className="mt-4">
          <SectionHeading
            eyebrow="Ubicación"
            title={wedding.venue}
            subtitle={wedding.address}
            icon={<MapPin size={12} />}
          />

          <div className="space-y-4">
            <div className="rounded-[28px] bg-[#fff8f3]/84 px-4 py-4 ring-1 ring-[#eadfd4] shadow-[0_12px_34px_rgba(184,154,129,0.08)]">
              <p className="text-sm font-semibold text-[#4b3d35]">
                Información importante
              </p>
              <p className="mt-2 text-[15px] leading-7 text-[#756458]">
                Con mucho cariño, queremos que este día sea una celebración para
                adultos, por lo que la invitación está pensada para invitados
                mayores de 15 años. Gracias por comprender y acompañarnos.
              </p>
            </div>

            <InvitationImage
              src="/invitacion/fotoSalon.jpeg"
              alt="Foto exterior del salón Palazzio"
            />

            <div className="overflow-hidden rounded-[32px] border border-[#eadccf] bg-white/88 shadow-[0_16px_40px_rgba(184,154,129,0.10)]">
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
              className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#c9a98d] px-4 py-3.5 text-sm font-semibold text-[#fffaf6] shadow-[0_14px_30px_rgba(184,154,129,0.20)] transition hover:translate-y-[-1px] hover:bg-[#c29f82] active:translate-y-0"
            >
              <MapPin size={16} />
              Abrir ubicación en Maps
            </a>
          </div>
        </section>

        <ElegantDivider />

        <section className="mt-4">
          <SectionHeading
            eyebrow="Dress code"
            title="Elegante clásico con toque minimalista"
            subtitle="Queremos que te sientas increíble y en armonía con la celebración."
            icon={<Shirt size={12} />}
          />

          <div className="rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.90),rgba(255,250,246,0.82))] p-4 ring-1 ring-[#eadfd4] shadow-[0_14px_35px_rgba(184,154,129,0.10)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#4b3d35]">
                Tonos sugeridos para vestidos
              </p>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-[#9a8478]">
                <span>Desliza</span>
                <ChevronRight size={13} />
              </div>
            </div>

            <div className="relative mt-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#fffaf6] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#fffaf6] to-transparent" />

              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {womenPalette.map((tone) => (
                  <div
                    key={tone.name}
                    className="min-w-[112px] snap-start rounded-[22px] bg-white/92 p-3 text-center ring-1 ring-[#eadfd4] shadow-[0_8px_20px_rgba(184,154,129,0.08)]"
                  >
                    <div
                      className="mx-auto h-12 w-12 rounded-full border border-white/70"
                      style={{ backgroundColor: tone.hex }}
                    />
                    <p className="mt-2 text-[11px] leading-4 text-[#7b6a60]">
                      {tone.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-sm text-[#8f7a6d]">No rojo · No blanco</p>
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

            <div className="rounded-[28px] bg-[#fff8f3]/84 px-4 py-4 ring-1 ring-[#eadfd4] shadow-[0_12px_34px_rgba(184,154,129,0.08)]">
              <ul className="space-y-2 text-sm leading-6 text-[#75655b]">
                {dressRules.map((rule) => (
                  <li key={rule}>• {rule}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowDressIdeas(true)}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#eadccf] bg-white/84 px-4 py-3.5 text-sm font-medium text-[#6d5a4f] shadow-[0_10px_22px_rgba(184,154,129,0.10)] transition hover:bg-white"
            >
              Consultar más ideas
            </button>
          </div>
        </section>

        <ElegantDivider />

        <section className="mt-4">
          <SectionHeading
            eyebrow="Buzón de dinero"
            title="Tu presencia es lo más importante"
            subtitle={wedding.moneyBoxText}
            icon={<Gift size={12} />}
          />

          <InvitationImage
            src="/invitacion/buzonDeDinero.jpg"
            alt="Buzón de dinero"
          />
        </section>

        <ElegantDivider />

        <section className="mt-4">
          <SectionHeading
            eyebrow="Confirmación"
            title="Confirma tu asistencia a la boda"
            subtitle="Tu registro será agregado a la lista de acceso."
            icon={<Users size={12} />}
          />

          <div className="mb-4 rounded-[28px] bg-[#fff8f3]/84 px-4 py-4 ring-1 ring-[#eadfd4] shadow-[0_12px_34px_rgba(184,154,129,0.08)]">
            <p className="text-sm font-semibold text-[#4b3d35]">Importante</p>
            <p className="mt-2 text-sm leading-6 text-[#7b6a60]">
              Favor de confirmar por persona, no por familia. La invitación para
              la boda está pensada para invitados mayores de 15 años.
            </p>
          </div>

          <RSVPForm
            title="Datos del invitado"
            note="Completa tu información para registrar correctamente tu acceso."
            state={weddingRsvp}
            setState={setWeddingRsvp}
            buttonLabel="Confirmo que asistiré"
            href={`https://wa.me/${wedding.weddingWhatsapp.replace(
              /\D/g,
              ""
            )}?text=${weddingMessage}`}
          />
        </section>

        <ElegantDivider />

        <section className="mt-4">
          <SectionHeading
            eyebrow="Tornaboda"
            title="Y que la celebración continúe..."
            subtitle="Acompáñanos a nuestra tornaboda para seguir compartiendo este momento tan especial juntos."
            icon={<Sparkles size={12} />}
          />

          <div className="space-y-3">
            <div className="rounded-[28px] bg-[#fff8f3]/84 px-4 py-4 ring-1 ring-[#eadfd4] shadow-[0_12px_34px_rgba(184,154,129,0.08)]">
              <p className="text-lg font-medium text-[#4b3d35]">
                {wedding.tornabodaTime} · {wedding.tornabodaLocation}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#7b6a60]">
                Solo lleva tu bebida favorita.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#fff8f3]/84 px-4 py-4 ring-1 ring-[#eadfd4] shadow-[0_12px_34px_rgba(184,154,129,0.08)]">
              <p className="text-sm font-semibold text-[#4b3d35]">
                Evento familiar
              </p>
              <p className="mt-2 text-sm leading-6 text-[#7b6a60]">
                En la tornaboda se aceptan invitados de todas las edades.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <RSVPForm
              title="Datos del invitado"
              note="Completa tu información para registrar correctamente tu acceso a la tornaboda."
              state={afterRsvp}
              setState={setAfterRsvp}
              buttonLabel="Confirmar asistencia a la tornaboda"
              href={`https://wa.me/${wedding.tornabodaWhatsapp.replace(
                /\D/g,
                ""
              )}?text=${afterMessage}`}
            />
          </div>

          <div className="mt-4 rounded-[30px] bg-[#fff8f3]/84 px-4 py-4 ring-1 ring-[#eadfd4] shadow-[0_12px_34px_rgba(184,154,129,0.08)]">
            <p className="text-sm font-medium text-[#4b3d35]">
              Ubicación de la tornaboda
            </p>
            <p className="mt-2 text-sm leading-6 text-[#7b6a60]">
              {wedding.tornabodaAddress}
            </p>

            <div className="mt-4 overflow-hidden rounded-[30px] border border-[#eadccf] bg-white/90 shadow-[0_16px_40px_rgba(184,154,129,0.10)]">
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
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#c9a98d] px-4 py-3.5 text-sm font-semibold text-[#fffaf6] shadow-[0_14px_30px_rgba(184,154,129,0.20)] transition hover:translate-y-[-1px] hover:bg-[#c29f82] active:translate-y-0"
            >
              <MapPin size={16} />
              Abrir ubicación de la tornaboda
            </a>
          </div>
        </section>

        <ElegantDivider />

        <section className="mt-4">
          <SectionHeading
            eyebrow="Nuestra sesión"
            title="Un pequeño vistazo de nosotros"
            icon={<Heart size={12} />}
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

        <footer className="relative px-4 pb-10 pt-10 text-center">
          <div className="mx-auto mb-5 h-px w-28 bg-gradient-to-r from-transparent via-[#d7bca6] to-transparent" />
          <p className="text-[1.08rem] font-medium italic tracking-[0.01em] text-[#6c5649]">
            {wedding.galleryClosingQuote}
          </p>
        </footer>
      </div>

      {showDressIdeas ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#7b6557]/24 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-[34px] border border-[#eadccf] bg-[#f8f2ec] p-5 text-[#4b3d35] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a8478]">
                  Dress code
                </p>
                <h3 className="mt-1 text-2xl font-semibold">
                  Más ideas de estilo
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowDressIdeas(false)}
                className="rounded-full border border-[#eadccf] bg-white/82 p-2 text-[#6d5a4f]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {ideas.map((idea) => (
                <div
                  key={idea.text}
                  className="rounded-[28px] bg-white/78 p-4 ring-1 ring-[#eadfd4] shadow-[0_10px_24px_rgba(184,154,129,0.08)]"
                >
                  <InvitationImage src={idea.src} alt={idea.text} />
                  <p className="mt-3 text-sm leading-6 text-[#75655b]">
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