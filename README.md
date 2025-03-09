# Fullstack Test (BE) - Ivan Rizky Saputra

![thumbnail](https://res.cloudinary.com/draaoe7rc/image/upload/v1741524757/7218c317-1507-4347-a4eb-fa5bcf6ade26.png)

<p align="center">
<a href="https://tsp-test-fe.vercel.app/">Live Demo</a>
</p>

API Collection yang dibuat untuk mengikuti Fullstack Test untuk PT Tri Sinar Purnama. Dilengkapi Role Base Access Control untuk management pengguna (Production Manager dan Operator). Untuk frontend dapat di akses di repo [ini](https://github.com/Ivanrizkys/tsp-test-fe). Postman collection dapat dilihat di email yang telah dikirimkan.

## Tech Stack

- Express
- Typescript
- PostgreSQL with Drizzle ORM
- RBAC Adoption.

## Requirement
- Node 22.11.0 
- Pnpm [Lihat Cara Installasi](https://pnpm.io/installation)

## Run on Local

- Clone github repository ini.
- Masuk ke directory penyimpanan.
- Install semua dependency mengunakan "pnpm install" atau menggunakan package manager lainya.
- Jalankan `pnpm db:migrate` untuk meng generate database yang dibutuhkan. Dapat juga cek database.sql untuk proses database migration.
- Setup ".env" file, dapat melihat ".env.example" sebagai acuan.
- Selanjutnya, jalankan project di terminal menggunakan "pnpm run dev" atau menggunakan package manager lainya.
- Testing di postman atau alternatif lain di [http://localhost:8000/](http://localhost:8000/).

## Deploy on Render

Untuk memudahkan proses deployment, service ini di deploy di Render. Untuk langkah langkah deployment bisa melihat di [sini](https://render.com/docs/deploy-node-express-app). Namun, ada beberpa penyesuaian yang harus dilakukan

- Ubah build command menjadi `pnpm install --frozen-lockfile && pnpm build`
- Start command diubah menjadi `node --experimental-loader ./resolver.js dist/src/index.js`

## Deploy on Own VPS

Kurang lebih, langkah langkah untuk proses deployment project ini di vps adalah seperti ini.

- Install Nodejs (disarankan untuk menggunakan versi 22.11.0).
- Instlal pnpm untuk package managernya.
- Install nginx atau alternatif lainya.
- Jalankan perintah `pnpm install` setelah itu `pnpm build`. Folder dist akan dihasilkan setelah proses ini selesai.
- Setelah itu jalankan perintah `node --experimental-loader ./resolver.js dist/src/index.js`
- Arahkan proxy dengan menggunakan nginx ke post 8000 atau sesuai yang ditambahkan .env.
