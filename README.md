#npm run dev dendikten sonra o+enter ile websitesi açılabilir
#api klasörünü yol gösterdikten sonra json-server --watch db.json ile json dosyası işlenebilir hale gelir.

#Docker ile Çalıştırma

- Proje, Docker yüklemeyi unutmayın! Node.js 22.13.1 sürümünü kullanır (Dockerfile'da belirtilmiştir).
- Uygulama ve API için iki ayrı servis vardır: `js-app` (frontend) ve `json-server` (API).
- Ortam değişkeni gerekmemektedir (Dockerfile ve compose dosyasında özel bir değişken yoktur).

## Docker Compose ile Başlatma

```sh
# Proje kök dizininde aşağıdaki komut ile başlatabilirsiniz:
docker compose up --build
```

- `js-app` servisi Vite preview ile 5173 portunda çalışır (http://localhost:5173).
- `json-server` servisi 3000 portunda çalışır (http://localhost:3000) ve `api/db.json` dosyasını izler.
- Her iki servis aynı bridge network (`appnet`) üzerinde çalışır.

## Notlar
- API servisi için `api` klasörü ve içindeki `db.json` dosyası gereklidir.
- Gerekirse `.env` dosyası desteği eklemek için compose dosyasındaki ilgili satırları açabilirsiniz.

---

## Docker ile Projeyi Çalıştırmak (Güncel)

- Proje, Node.js 22.13.1 sürümünü temel alır (Dockerfile'da `ARG NODE_VERSION=22.13.1`).
- Frontend uygulaması için Vite kullanılır ve production build sonrası `npx vite preview` ile servis edilir.
- API için `json-server` kullanılır ve `api/db.json` dosyasını izler.
- Ortam değişkeni gerekmemektedir; Dockerfile ve compose.yaml dosyalarında özel bir değişken tanımlı değildir.

### Docker Compose ile Başlatma

```sh
docker compose up --build
```

- `js-Cbulingo-MVP` servisi (frontend) 5173 portunda çalışır: http://localhost:5173
- `json-server-api` servisi (API) 3000 portunda çalışır: http://localhost:3000
- Her iki servis `appnet` adlı bridge network üzerinde çalışır.

### Özel Yapılandırmalar
- Frontend servisi, production build sonrası sadece `dist` klasörünü ve production bağımlılıklarını içerir.
- API servisi salt-okunur olarak `api/db.json` dosyasını mount eder.
- Gerekirse `.env` dosyası desteği için compose.yaml içindeki ilgili satırları açabilirsiniz.

### Portlar
- Frontend (`js-Cbulingo-MVP`): 5173 (host) → 4173 (container)
- API (`json-server-api`): 3000 (host) → 80 (container)

### Mobil Debug
- Android Studio indirip kurun.
- ve cd Cbulingo-MVP seçildikten sonra npm run build, npx cap sync, android npx cap run android şeklinde projeyi mobil için güncelleyin.
