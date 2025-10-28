import con from '../repository/conection.js';


export async function inserirConsulta(consulta) {
  const comando = `
    INSERT INTO tb_agenda (motivo, especialidade, nm_medico, data_consulta, hora, hospital, id_usuario) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [resultado] = await con.query(comando, [
    consulta.motivo,
    consulta.especialidade,
    consulta.medico,
    consulta.data,
    consulta.hora,
    consulta.hospital,
    consulta.id_usuario
  ]);

  return resultado.insertId;
}

export async function listarConsultasPorUsuario(idUsuario) {
  const comando = `
    SELECT 
      id_consulta AS id,
      motivo,
      especialidade,
      nm_medico AS medico,
      data_consulta AS data,
      hora,
      hospital
    FROM tb_agenda
    WHERE id_usuario = ?
    ORDER BY id_consulta DESC
  `;
  
  const [linhas] = await con.query(comando, [idUsuario]);
  return linhas;
}