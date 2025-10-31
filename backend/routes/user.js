import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/user - list all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nama_produk, p.tahun_rilis, m.nama_merk, k.nama_kategori, p.harga 
      FROM produk p
      LEFT JOIN merk m ON p.merk_id = m.id
      LEFT JOIN kategori k ON p.kategori_id = k.id
      ORDER BY p.id
    `);
    res.json(rows);
  } catch (err) {
    // Kirim pesan error yang lebih spesifik
    console.error("❌ Error executing query:", err);
    res.status(500).json({
      message: "Gagal mengambil data produk dari database.",
      error: err.message,
      // Memberi petunjuk jika tabel tidak ada
      hint: "Pastikan Anda sudah meng-import file .sql dan tabel 'produk', 'merk', dan 'kategori' sudah ada di database."
    });
  }
});
// FUNGSI 2 (BARU): Mengambil SATU produk berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Mengambil ID dari URL
        const [rows] = await pool.query(`
      SELECT p.*, m.nama_merk, k.nama_kategori
      FROM produk p
      LEFT JOIN merk m ON p.merk_id = m.id
      LEFT JOIN kategori k ON p.kategori_id = k.id
      WHERE p.id = ?
    `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Produk dengan ID tersebut tidak ditemukan.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal mengambil data produk.", error: err.message });
    }
});

// FUNGSI 3 (BARU): Membuat produk BARU
router.post('/', async (req, res) => {
    try {
        const { nama_produk, tahun_rilis, merk_id, kategori_id, harga } = req.body;

        // Validasi sederhana
        if (!nama_produk || !merk_id || !kategori_id) {
            return res.status(400).json({ message: 'Nama produk, merk_id, dan kategori_id wajib diisi.' });
        }

        const [result] = await pool.query(
            'INSERT INTO produk (nama_produk, tahun_rilis, merk_id, kategori_id, harga) VALUES (?, ?, ?, ?, ?)',
            [nama_produk, tahun_rilis, merk_id, kategori_id, harga]
        );

        res.status(201).json({ message: 'Produk berhasil dibuat!', insertedId: result.insertId });
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal membuat produk baru.", error: err.message });
    }
});

// FUNGSI 4 (BARU): Memperbarui (UPDATE) produk
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_produk, tahun_rilis, merk_id, kategori_id, harga } = req.body;

        const [result] = await pool.query(
            'UPDATE produk SET nama_produk = ?, tahun_rilis = ?, merk_id = ?, kategori_id = ?, harga = ? WHERE id = ?',
            [nama_produk, tahun_rilis, merk_id, kategori_id, harga, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk dengan ID tersebut tidak ditemukan.' });
        }

        res.json({ message: `Produk dengan ID ${id} berhasil diperbarui.` });
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal memperbarui produk.", error: err.message });
    }
});

// FUNGSI 5 (BARU): Menghapus produk
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM produk WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk dengan ID tersebut tidak ditemukan.' });
        }

        res.status(200).json({ message: `Produk dengan ID ${id} berhasil dihapus.` });
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal menghapus produk.", error: err.message });
    }
});
// Anda bisa menambahkan rute lain (GET by ID, POST, PUT, DELETE) di sini di masa depan

export default router;
