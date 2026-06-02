"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#142B6F] text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Kiri - PUPR */}
          <div className="flex items-center gap-3">
            <Image
              src="/logopu.png"
              alt="Logo PUPR"
              width={42}
              height={42}
              className="object-contain"
            />

            <div>
              <p className="text-[13px] md:text-[14px] font-semibold leading-tight">
                Pusat Data dan Teknologi Informasi
              </p>

              <p className="text-[11px] md:text-[12px] text-blue-200 leading-tight">
                Kementerian Pekerjaan Umum
              </p>
            </div>
          </div>

          {/* Tengah */}
          <div className="text-center">
            <p className="text-[12px] md:text-[13px] font-semibold">
              Penyimpanan Dokumen Kementerian PU Secara Digital & Terintegrasi
            </p>
          </div>

          {/* Kanan - Universitas */}
          <div className="flex items-center gap-3">
            <Image
              src="/logoupn.png"
              alt="Logo Universitas"
              width={50}
              height={50}
              className="object-contain"
            />

            <div className="text-center md:text-right">
              <p className="text-[13px] md:text-[14px] font-semibold leading-tight">
                Universitas Pembangunan Nasional
              </p>
              <p className="text-[13px] md:text-[14px] font-semibold leading-tight">
                Veteran Jakarta
              </p>
              <p className="text-[11px] md:text-[12px] text-blue-200 leading-tight">
                Fakultas Ilmu Komputer / Informatika
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-blue-400/30 mt-5 pt-4 text-center">
          <p className="text-[11px] md:text-[12px] text-blue-200">
            © {new Date().getFullYear()} Kementerian PU & Universitas Pembangunan Nasional Veteran Jakarta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}