import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AdesivoParede() {
  const navigate = useNavigate();
  const { id: servicoId } = useParams(); // pega id da url, como no outro
  const { user, token } = useAuth();

  const [showPopup, setShowPopup] = useState(false);

  const [numParedes, setNumParedes] = useState('');
  const [altura, setAltura] = useState('');
  const [unidadeAltura, setUnidadeAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [unidadeLargura, setUnidadeLargura] = useState('');
  const [tipoAdesivo, setTipoAdesivo] = useState('');
  const [corAdesivo, setCorAdesivo] = useState('');
  const [dataServico, setDataServico] = useState('');
  const [horaServico, setHoraServico] = useState('');
  const [clienteId, setClienteId] = useState(null);

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
    setNumParedes('');
    setAltura('');
    setUnidadeAltura('');
    setLargura('');
    setUnidadeLargura('');
    setTipoAdesivo('');
    setCorAdesivo('');
    setDataServico('');
    setHoraServico('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clienteId) {
      alert('ID do cliente ainda não carregado.');
      return;
    }

    if (!token) {
      navigate('/register');
      return;
    }

    const materialId = 2; // ajuste se precisar
    // servicoId já vem do params (url)

    const dados = {
      clienteId,
      servicoId: Number(servicoId),
      materialId,
      altura: Number(altura),
      unidadeAltura,
      largura: Number(largura),
      unidadeLargura,
      dataServico,
      horaServico,
      observacoes: '',
      dadosExtras: {
        tipoServico: 'Adesivo de Parede',
        tipoAdesivo,
        numParedes: Number(numParedes),
        corAdesivo,
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

        <p className="form-warning">
          ⚠️ <strong>Observação:</strong> As medidas podem ser aproximadas. Um de nossos profissionais irá medir corretamente no local.
        </p>

        <div className="form-group">
          <label>Número de paredes:</label>
          <input
            type="number"
            step="1"
            value={numParedes}
            onChange={(e) => setNumParedes(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de adesivo:</label>
          <select
            value={tipoAdesivo}
            onChange={(e) => setTipoAdesivo(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            <option>Impressão Digital</option>
            <option>Liso</option>
            <option>Decorativo</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cor do adesivo:</label>
          <input
            type="text"
            value={corAdesivo}
            onChange={(e) => setCorAdesivo(e.target.value)}
            required
          />
        </div>

        <div className="form-section">
          <p><strong>Informe as dimensões da área de aplicação</strong></p>

          <div className="form-group">
            <label>Altura:</label>
            <div className="input-row">
              <input
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                required
                style={{ flex: '2' }}
                min="0"
                step="any"
              />
              <select
                value={unidadeAltura}
                onChange={(e) => setUnidadeAltura(e.target.value)}
                required
                style={{ flex: '1' }}
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
                style={{ flex: '2' }}
                min="0"
                step="any"
              />
              <select
                value={unidadeLargura}
                onChange={(e) => setUnidadeLargura(e.target.value)}
                required
                style={{ flex: '1' }}
              >
                <option value="">Unidade de medida</option>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <p><strong>Data e hora do serviço</strong></p>

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

export default AdesivoParede;
