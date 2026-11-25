"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import Reveal from "./Reveal";

const Especialidades = ({ items, titulo, descripcion }) => {
  const lista = items?.length ? items : [];
  const [abierta, setAbierta] = useState(null);

  return (
    <section
      id="especialidades"
      data-navbar-color="#f2f3ff"
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-16"
      style={{ background: "#f2f3ff" }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-[680px] text-center sm:mb-12"
        >
          <p className="font-titulo text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0F3A7A] sm:text-[15px]">
            Especialidades
          </p>
          <h3 className="mt-2 font-titulo text-[26px] font-semibold leading-tight text-[#1F1F1F] sm:text-[30px] md:text-[38px]">
            {titulo || "Acompañamiento para cada etapa"}
          </h3>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-[#26262C] sm:text-[16px]">
            {descripcion || "Un equipo interdisciplinario que trabaja de forma complementaria según las necesidades de cada persona."}
          </p>
        </motion.div>

        {/* GRID — desktop: hover overlay | mobile: tap abre modal */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 lg:gap-6">
          {lista.map((esp, i) => (
            <Reveal
              key={esp.slug}
              delay={(i % 3) * 0.08}
              className="group relative aspect-square w-[calc(50%-6px)] overflow-hidden rounded-none bg-white p-1 shadow-[0_2px_16px_rgba(30,40,80,0.08)] ring-1 ring-[#0F3A7A]/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,58,122,0.22)] sm:w-[calc(50%-10px)] lg:w-[270px] xl:w-[285px]"
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={esp.imagen}
                  alt={esp.nombre}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 285px"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-auto"
                />
                {/* Título siempre visible abajo izquierda (también en desktop).
                    Al hacer hover se oculta y entra el overlay con la info completa. */}
                <div className="absolute bottom-4 left-0 bg-black/60 px-2 py-1 transition-opacity duration-300 sm:bottom-6 sm:px-3 sm:py-1.5 lg:group-hover:opacity-0">
                  <h4 className="font-titulo text-[11px] font-semibold leading-snug text-white sm:text-[16px]">
                    {esp.nombre}
                  </h4>
                </div>
                {/* Overlay hover SOLO desktop */}
                <div className="hidden lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-end lg:bg-[#0F3A7A]/90 lg:p-3 lg:opacity-0 lg:transition-all lg:duration-400 lg:group-hover:opacity-100 lg:sm:p-5">
                  {esp.tag && (
                    <span className="mb-1 w-fit bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {esp.tag}
                    </span>
                  )}
                  <p className="translate-y-2 text-[12.5px] leading-5 text-white/90 lg:transition-transform lg:duration-400 lg:group-hover:translate-y-0">
                    {esp.descripcion}
                  </p>
                </div>
                {/* Botón invisible para tap en móvil */}
                <button
                  className="lg:hidden absolute inset-0 z-10"
                  onClick={() => setAbierta(esp)}
                  aria-label={`Ver detalles de ${esp.nombre}`}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* MODAL MÓVIL */}
      {abierta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0A1830]/60 backdrop-blur-sm"
          onClick={() => setAbierta(null)}
          role="dialog"
          aria-modal="true"
          aria-label={abierta.nombre}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-white rounded-[20px] overflow-hidden shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setAbierta(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0F3A7A] shadow transition-colors hover:bg-[#0F3A7A] hover:text-white"
            >
              <X size={20} />
            </button>
            <img
              src={abierta.imagen}
              alt={abierta.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              {abierta.tag && abierta.tag !== abierta.nombre && (
                <span className="inline-block mb-2 rounded-full bg-[#EAF4FB] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0F3A7A]">
                  {abierta.tag}
                </span>
              )}
              <h4 className="font-titulo text-[20px] font-semibold text-[#1F1F1F]">
                {abierta.nombre}
              </h4>
              <p className="mt-3 text-[14px] leading-6 text-[#3D3D3D]">
                {abierta.descripcion}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Especialidades;
