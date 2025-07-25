import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function PlacaSinalizacao() {
  const navigate = useNavigate();
  const { id } = useParams(); // servicoId
  const { user, token } = useAuth();
  const [clienteId, setClienteId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [material, setMaterial] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [altura, setAltura] = useState('');
  const [unidadeAltura, setUnidadeAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [unidadeLargura, setUnidadeLargura] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [dataServico, setDataServico] = useState('');
  const [horaServico, setHoraServico] = useState('');
  const hoje = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`https://ideiafix-back-end-1test.onrender.com/api/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Erro ao buscar cliente');

        const data = await response.json();
        const idCliente = data.Cliente?.id;

        if (idCliente) {
          setClienteId(idCliente);
        } else {
          alert('Cliente não encontrado');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar dados do cliente');
      }
    };

    if (user?.id && token) {
      fetchCliente();
    }
  }, [user, token]);

  const resetForm = () => {
    setMaterial('');
    setQuantidade('');
    setAltura('');
    setUnidadeAltura('');
    setLargura('');
    setUnidadeLargura('');
    setArquivo(null);
    setDataServico('');
    setHoraServico('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clienteId) {
      alert("ID do cliente ainda não carregado.");
      return;
    }

    const dados = {
      clienteId,
      servicoId: Number(id),
      materialId:3 , // ajuste conforme seu banco
      largura: Number(largura),
      unidadeLargura,
      altura: Number(altura),
      unidadeAltura,
      dataServico,
      horaServico,
      observacoes: '',
      dadosExtras: {
        tipoServico: 'Placa de Sinalização',
        tipoMaterial: material,
        quantidade: Number(quantidade),
        nomeArquivo: arquivo?.name || '',
      },
    };

    try {
      const response = await fetch('https://ideiafix-back-end-1test.onrender.com/orcamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
      });

      if (response.ok) {
        setShowPopup(true);
        resetForm();
      } else {
        alert('Erro ao enviar os dados. Verifique os campos e tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="service-form">
        <h3>Preencha os dados abaixo:</h3>

        <div className="form-group">
          <label>Material:</label>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} required>
            <option value="">Selecione</option>
            <option>PVC</option>
            <option>Acrílico</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantidade de placas:</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>

        <div className="form-section">
          <p><strong>Informe as dimensões do objeto</strong></p>

          <div className="form-group">
            <label>Altura:</label>
            <div className="input-row">
              <input
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                required
                min="0"
                step="any"
              />
              <select
                value={unidadeAltura}
                onChange={(e) => setUnidadeAltura(e.target.value)}
                required
              >
                <option value="">Unidade de medida</option>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Largura:</label>
            <div className="input-row">
              <input
                type="number"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
                required
                min="0"
                step="any"
              />
              <select
                value={unidadeLargura}
                onChange={(e) => setUnidadeLargura(e.target.value)}
                required
              >
                <option value="">Unidade de medida</option>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Upload da arte:</label>
          <div className="file-upload">
            <label htmlFor="file-upload" className="upload-button">
              Selecionar arquivo
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setArquivo(e.target.files[0])}

            />
            {arquivo && <span className="file-name">{arquivo.name}</span>}
          </div>
        </div>

        <div className="form-section">
          <p><strong>Quando o serviço deve estar pronto?</strong></p>

          <div className="input-row">
            <div className="form-group">
              <label>Data:</label>
              <input
                type="date"
                min={hoje}
                value={dataServico}
                onChange={(e) => setDataServico(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora:</label>
              <input
                type="time"
                value={horaServico}
                onChange={(e) => setHoraServico(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit">Enviar</button>
        </div>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Mensagem</h2>
            <p>Seu agendamento está em análise, em breve devolveremos uma resposta!</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

export default PlacaSinalizacao;
