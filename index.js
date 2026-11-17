// Muat variabel dari berkas .env ke process.env (PORT dan AMQP_URL)
require('dotenv').config()

// Impor framework Express untuk membuat HTTP server
const express = require("express");
// Buat instance aplikasi Express
const app = express();

// Impor body-parser (disediakan untuk parsing body request bila dibutuhkan)
const bp = require("body-parser");

// Impor library amqplib untuk berkomunikasi dengan RabbitMQ via protokol AMQP
const amqp = require("amqplib");
// Ambil alamat server RabbitMQ dari environment variable AMQP_URL
const amqpServer = process.env.AMQP_URL;
// Variabel global untuk menyimpan channel dan koneksi ke RabbitMQ
var channel, connection;

// Hubungkan ke RabbitMQ dan mulai mendengarkan queue saat aplikasi dijalankan
connectToQueue();

// Fungsi untuk terhubung ke RabbitMQ dan mengonsumsi pesan dari queue "order"
async function connectToQueue() {
    // Tangani kemungkinan error saat terhubung atau mengonsumsi pesan
    try {
        // Buka koneksi ke server RabbitMQ
        connection = await amqp.connect(amqpServer);
        // Buat channel di atas koneksi tersebut
        channel = await connection.createChannel();
        // Pastikan queue "order" ada (dibuat bila belum ada)
        await channel.assertQueue("order");
        // Konsumsi setiap pesan yang masuk ke queue "order"
        channel.consume("order", data => {
            // Cetak isi data order yang diterima ke console
            console.log(`Order received: ${Buffer.from(data.content)}`);
            // Cetak informasi bahwa order akan segera dikirim
            console.log("** Will be shipped soon! **\n")
            // Kirim acknowledgement agar pesan dihapus dari queue
            channel.ack(data);
        // Akhir callback consume
        });
    // Tangkap error yang terjadi
    } catch (ex) {
        // Tampilkan error di console
        console.error(ex);
    // Akhir blok try-catch
    }
// Akhir fungsi connectToQueue
}

// Jalankan HTTP server pada port dari environment variable PORT
app.listen(process.env.PORT, () => {
    // Tampilkan port yang dipakai server
    console.log(`Server running at ${process.env.PORT}`);
// Akhir callback app.listen
});
