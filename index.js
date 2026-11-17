// Muat variabel dari berkas .env ke process.env (PORT dan AMQP_URL)
require('dotenv').config()

// Impor framework Express untuk membuat HTTP server
const express = require("express");
// Buat instance aplikasi Express
const app = express();

// Impor body-parser untuk membaca body request
const bp = require("body-parser");
// Aktifkan parsing body request berformat JSON
app.use(bp.json());

// Impor library amqplib untuk berkomunikasi dengan RabbitMQ via protokol AMQP
const amqp = require("amqplib");
// Ambil alamat server RabbitMQ dari environment variable AMQP_URL
const amqpServer = process.env.AMQP_URL;
// Variabel global untuk menyimpan channel dan koneksi ke RabbitMQ
var channel, connection;

// Hubungkan ke RabbitMQ saat aplikasi pertama kali dijalankan
connectToQueue();

// Fungsi untuk membuat koneksi dan channel ke RabbitMQ
async function connectToQueue() {
    // Buka koneksi ke server RabbitMQ
    connection = await amqp.connect(amqpServer);
    // Buat channel di atas koneksi tersebut
    channel = await connection.createChannel();
    // Tangani kemungkinan error saat menyiapkan queue
    try {
        // Nama queue yang dipakai untuk mengirim data order
        const queue = "order";
        // Pastikan queue "order" ada (dibuat bila belum ada)
        await channel.assertQueue(queue);
        // Tampilkan pesan bahwa koneksi ke queue berhasil
        console.log("Connected to the queue!")
    // Tangkap error yang terjadi
    } catch (ex) {
        // Tampilkan error di console
        console.error(ex);
    // Akhir blok try-catch
    }
// Akhir fungsi connectToQueue
}

// Endpoint POST /order untuk menerima data order dalam format JSON
app.post("/order", (req, res) => {
    // Ambil objek order dari body request
    const { order } = req.body;
    // Kirim data order ke queue RabbitMQ
    createOrder(order);
    // Kembalikan data order sebagai response ke client
    res.send(order);
// Akhir handler endpoint /order
});

// Fungsi untuk mengirim data order ke queue RabbitMQ
const createOrder = async order => {
    // Nama queue tujuan
    const queue = "order";
    // Kirim data order (diubah menjadi JSON lalu Buffer) ke queue
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    // Tampilkan pesan bahwa order berhasil dibuat
    console.log("Order succesfully created!")
    // Daftarkan handler sekali saja untuk sinyal SIGINT (misalnya Ctrl+C)
    process.once('SIGINT', async () => {
        // Tampilkan pesan bahwa koneksi akan ditutup
        console.log('got sigint, closing connection');
        // Tutup channel RabbitMQ
        await channel.close();
        // Tutup koneksi RabbitMQ
        await connection.close();
        // Hentikan proses aplikasi dengan status sukses
        process.exit(0);
    // Akhir handler SIGINT
    });
// Akhir fungsi createOrder
};

// Jalankan HTTP server pada port dari environment variable PORT
app.listen(process.env.PORT, () => {
    // Tampilkan port yang dipakai server
    console.log(`Server running at ${process.env.PORT}`);
// Akhir callback app.listen
});
