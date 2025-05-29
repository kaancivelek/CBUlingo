import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createMixedWordPool, addNewWord, updateWord } from '../../utils/WordController';
import { loginUser, registerUser, forgotPassword } from '../../utils/LogonController';
import { useNavigate } from 'react-router-dom';

export default function ServiceTest() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('word'); // 'word' veya 'auth'
  
  const navigate = useNavigate();

  // Word Controller Tests
  const testCreateMixedWordPool = async () => {
    const userId = prompt('Kullanıcı ID:');
    const count = prompt('Kelime sayısı:');
    if (!userId || !count) {
      toast.error('Kullanıcı ID ve kelime sayısı gerekli');
      return;
    }

    try {
      setLoading(true);
      const result = await createMixedWordPool(parseInt(userId), parseInt(count));
      setResults(result);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Kelime havuzu oluşturuldu');
      }
    } catch (error) {
      const errorMessage = error.message || 'Kelime havuzu oluşturulurken hata oluştu';
      toast.error(errorMessage);
      setResults({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const testAddNewWord = async () => {
    const enName = prompt('İngilizce kelime:');
    const trName = prompt('Türkçe kelime:');
    const picUrl = prompt('Resim URL:');
    const enExample = prompt('İngilizce örnek cümle:');
    
    if (!enName || !trName) {
      toast.error('İngilizce ve Türkçe kelime zorunlu');
      return;
    }

    try {
      setLoading(true);
      const result = await addNewWord(enName, trName, picUrl, enExample);
      setResults(result);
      
      if (result.success) {
        toast.success(result.success);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = error.message || 'Kelime eklenirken hata oluştu';
      toast.error(errorMessage);
      setResults({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateWord = async () => {
    const enName = prompt('Güncellenecek İngilizce kelime:');
    if (!enName) {
      toast.error('Güncellenecek kelime adı gerekli');
      return;
    }

    const newEnName = prompt('Yeni İngilizce kelime (boş bırakabilirsiniz):');
    const newTrName = prompt('Yeni Türkçe kelime (boş bırakabilirsiniz):');
    const picUrl = prompt('Yeni resim URL (boş bırakabilirsiniz):');
    const enExample = prompt('Yeni İngilizce örnek cümle (boş bırakabilirsiniz):');
    
    // En az bir alan doldurulmuş olmalı
    if (!newEnName && !newTrName && !picUrl && !enExample) {
      toast.error('En az bir alan doldurulmalı');
      return;
    }

    try {
      setLoading(true);
      const result = await updateWord(
        enName, 
        newEnName || null, 
        newTrName || null, 
        picUrl || null, 
        enExample || null
      );
      setResults(result);
      
      if (result.success) {
        toast.success(result.success);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = error.message || 'Kelime güncellenirken hata oluştu';
      toast.error(errorMessage);
      setResults({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Auth Controller Tests
  const testLogin = async () => {
    const email = prompt('Email:');
    const password = prompt('Şifre:');
    if (!email || !password) {
      toast.error('Email ve şifre gerekli');
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password, navigate);
      setResults({ success: 'Giriş işlemi başlatıldı' });
    } catch (error) {
      const errorMessage = error.message || 'Giriş yapılırken hata oluştu';
      toast.error(errorMessage);
      setResults({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    const email = prompt('Email:');
    const fullName = prompt('Ad Soyad:');
    const password = prompt('Şifre:');
    if (!email || !fullName || !password) {
      toast.error('Tüm alanlar gerekli');
      return;
    }

    try {
      setLoading(true);
      await registerUser(email, {
        userEmail: email,
        userFullName: fullName,
        userPassword: password
      }, navigate);
      setResults({ success: 'Kayıt işlemi başlatıldı' });
    } catch (error) {
      const errorMessage = error.message || 'Kayıt olurken hata oluştu';
      toast.error(errorMessage);
      setResults({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const testForgotPassword = async () => {
    const email = prompt('Email:');
    const newPassword = prompt('Yeni şifre:');
    if (!email || !newPassword) {
      toast.error('Email ve yeni şifre gerekli');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email, { userPassword: newPassword });
      setResults({ success: 'Şifre güncelleme işlemi tamamlandı' });
    } catch (error) {
      const errorMessage = error.message || 'Şifre güncellenirken hata oluştu';
      toast.error(errorMessage);
      setResults({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Controller Test Sayfası</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('word')}
          className={`px-4 py-2 rounded ${activeTab === 'word' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Kelime Controller
        </button>
        <button
          onClick={() => setActiveTab('auth')}
          className={`px-4 py-2 rounded ${activeTab === 'auth' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Auth Controller
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Word Controller Tests */}
        {activeTab === 'word' && (
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Kelime Controller Testleri</h2>
            <div className="space-y-2">
              <button 
                onClick={testCreateMixedWordPool}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                disabled={loading}
              >
                Karma Kelime Havuzu Oluştur
              </button>
              <button 
                onClick={testAddNewWord}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                disabled={loading}
              >
                Yeni Kelime Ekle
              </button>
              <button 
                onClick={testUpdateWord}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
                disabled={loading}
              >
                Kelime Güncelle
              </button>
            </div>
          </div>
        )}

        {/* Auth Controller Tests */}
        {activeTab === 'auth' && (
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Auth Controller Testleri</h2>
            <div className="space-y-2">
              <button 
                onClick={testLogin}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
                disabled={loading}
              >
                Giriş Yap
              </button>
              <button 
                onClick={testRegister}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full"
                disabled={loading}
              >
                Kayıt Ol
              </button>
              <button 
                onClick={testForgotPassword}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
                disabled={loading}
              >
                Şifremi Unuttum
              </button>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Sonuçlar:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Yükleniyor...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
