# 🚀 Developer Growth Log

> "GitHub commit atar. Bu proje neden o commit'in atıldığını, hangi problemi çözdüğünü, hangi teknolojiyi ne zaman öğrendiğini kayıt altına alır." — kişisel teknik gelişim + kanıtlanabilir CV portföyü platformu.

[![NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![xUnit](https://img.shields.io/badge/Tests-xUnit%20Pass-brightgreen?logo=xunit)](https://xunit.net/)

---

## 🔗 Canlı Demo & Bağlantılar

- **Canlı Demo Web Uygulaması**: `http://localhost:5173` *(Local Dev)* / `https://growth-log.example.com` *(Prod Deployment)*
- **Backend Swagger API Dokümantasyonu**: `http://localhost:5000/swagger`
- **Örnek Kamusal Portföy**: `http://localhost:5173/p/ali-efe-d2414f`

---

## 🏗️ Clean Architecture & Proje Yapısı

```
growth-log/
├── backend/                  ASP.NET Core Web API (.NET 8)
│   ├── src/
│   │   ├── GrowthLog.Domain          Domain Entity'leri (Clean Architecture Çekirdeği)
│   │   ├── GrowthLog.Application     DTOs, Service Interface'leri, Validation & İş Kuralları
│   │   ├── GrowthLog.Infrastructure  EF Core AppDbContext, Services, Identity & Auth
│   │   └── GrowthLog.Api             Controllers, RateLimiter Middleware & DI Yapılandırması
│   └── tests/
│       ├── GrowthLog.Application.Tests  Unit Testler (xUnit, Moq, InMemory Db)
│       └── GrowthLog.Api.Tests          Integration Testler (WebApplicationFactory)
├── frontend/                 React 19 + TypeScript + Vite + Tailwind CSS v4
│   └── src/
│       ├── api/              Axios API modülleri & Interceptor
│       ├── components/       Re-usable UI bileşenleri & Sticky Navbar
│       ├── pages/            Dashboard, Profile, Projects, Showcase, Certificates, Analytics, Devlog
│       ├── context/          AuthContext (Merkezi Kimlik ve Profil Durumu)
│       └── routes/           ProtectedRoute & React Router v7
├── .env.example              Backend ortam değişkenleri şablonu
├── frontend/.env.example     Frontend ortam değişkenleri şablonu
├── .github/workflows/        GitHub Actions CI Pipeline (`ci.yml`)
└── docker-compose.yml        Local & Prod Docker Orchestration (SQL Server + API + Web)
```

---

## 💡 Mimari Kararlar ve Önemli Teknik Özellikler

1. **Clean Architecture (Temiz Mimari)**
   - Bağımlılık Yönü İlkesi (Dependency Inversion) uygulanarak iş kuralları veritabanından tamamen izole edildi. `GrowthLog.Domain` ve `GrowthLog.Application` veritabanından bağımsız unit test edilebilir.

2. **Problem → Çözüm Odaklı Proje Yönetimi**
   - Sıradan proje kartlarının aksine her projede 4 kritik aşama kayıt altına alınır:
     - **Problem Tanımı (ProblemStatement)**
     - **Denenen Yaklaşımlar (ApproachesTried)**
     - **Nihai Çözüm (FinalSolution)**
     - **Öğrenilen Dersler (LessonsLearned)**

3. **İlham Veren Topluluk Vitrini (Öne Çıkan Geliştiriciler & Örnek Portföyler)**
   - `/explore` sayfası sadece bir arama dizini değil; özenle hazırlanmış rol model portföyler (Full-Stack, Frontend, Backend, Mobile) ve gerçek kullanıcıların herkese açık hesaplarını sunan bir ilham galerisidir.

4. **Güvenlik: IP Bazlı Rate Limiting & Input Validation**
   - Auth endpoint'lerinde DataAnnotations ile sıkı girdi doğrulaması (`[EmailAddress]`, `[MinLength(8)]`).
   - ASP.NET Core `RateLimiter` middleware ile `/api/auth/*` endpoint'lerinde istemci IP'si bazında brute-force koruması (Fixed Window Rate Limiting: 5 istek / dak).

5. **JWT + Silent Refresh Token**
   - Access token 401 döndüğünde Axios Interceptor arka planda refresh token ile sessizce yeni token talep eder. Hata durumunda ziyaretçiyi sayfadan kovmak yerine misafir modunda tutar.

6. **Hazır Demo Hesabı & Otomatik Seed Verisi (`DbInitializer`)**
   - Veritabanı ilk açıldığında boş bir site izlenimi vermemek için doldurulmuş örnek profil, 3 detaylı Problem-Çözüm projesi, devlog'lar ve sertifikalar otomatik yüklenir.
   - **Demo Giriş Bilgileri**:
     - **E-posta**: `demo@growthlog.dev`
     - **Şifre**: `DemoUser123!`

---

## 📌 Bilinen Sınırlamalar, Mimari Kararlar ve Gelecek Planı (Roadmap)

1. **`/explore` Sayfasının Route Seviyesinde Ertelenmesi (Cold-Start UX Yönetimi)**
   - **Karar**: Yeni başlatılan platformlarda kullanıcı sayısının azlığı "boş sayfa" (Cold-Start) riski yaratır. Bu nedenle `/explore` route'u ve menü linkleri kod silinmeden `// TODO: yeterli kullanıcı sayısına ulaşınca tekrar aktif et` notuyla geçici olarak devredışı bırakılmıştır.
   - **Strateji**: Ziyaretçilere boş bir liste yerine doğrudan zengin içerikli örnek kamu portföyleri (`/p/ali-efe-demo`) sunulmaktadır.

2. **Güvenlik & Brute-Force Koruması**
   - Giriş ve kayıt endpoint'lerinde IP partitioning tabanlı Fixed Window Rate Limiting uygulanarak veritabanı yükü ve brute-force denemeleri engellenmektedir.

3. **Gelecek Planı (V3 Roadmap: Python & AI Microservice)**
   - **Plan**: Devlog yazılarından otomatik teknoloji çıkarımı, duygu analizi (sentiment analysis) ve kişiselleştirilmiş teknik gelişim önerileri için Python/FastAPI mikrohizmet entegrasyonu planlanmaktadır.

---

## 🚀 Hızlı Kurulum & Çalıştırma

### 1. Docker ile Çalıştırma (Önerilen)

```bash
docker-compose up --build -d
```
- **Frontend**: `http://localhost:5173`
- **Backend API & Swagger**: `http://localhost:5000/swagger`

---

### 2. Yerelde Manuel Çalıştırma

#### Backend (.NET 8 Web API)
```bash
cd backend
dotnet restore
dotnet run --project src/GrowthLog.Api
```

#### Frontend (Vite + React 19)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testleri Çalıştırma

### Backend Unit & Integration Testleri (xUnit + WebApplicationFactory)

```bash
dotnet test backend/GrowthLog.sln
```
> **20/20 Test Başarıyla Geçti** (`GrowthLog.Application.Tests` 13/13, `GrowthLog.Api.Tests` 7/7).

### Frontend Tip Kontrolü ve Production Build

```bash
cd frontend
npm run build
```

---

## 📄 Çevre Değişkenleri (.env)

Projede varsayılan yapılandırmalar için örnek şablon dosyaları mevcuttur:
- **Backend**: `/.env.example`
- **Frontend**: `/frontend/.env.example`

---

## 📸 Ekran Görüntüleri & Görsel Önizleme

| Ana Panel (Dashboard) | Öne Çıkan Geliştiriciler Vitrini |
| :---: | :---: |
| Gelişim grafikleri ve son projeler | İlham veren portföyler & filtreler |

| Profil & Şirket Paylaşım Linki | Analitik & Teknoloji Zaman Çizelgesi |
| :---: | :---: |
| Üye olmadan incelenebilen kamu portföyü | Kronolojik teknoloji kullanım geçmişi |

---

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
