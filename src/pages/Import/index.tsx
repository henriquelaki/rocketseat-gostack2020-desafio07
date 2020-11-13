import filesize from 'filesize';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import alert from '../../assets/alert.svg';
import FileList from '../../components/FileList';
import Header from '../../components/Header';
import Upload from '../../components/Upload';
import api from '../../services/api';
import { Container, Footer, ImportFileContainer, Title } from './styles';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    uploadedFiles.map(async file => {
      const data = new FormData();
      console.log('file', file.file, file.name);
      data.append('file', file.file, file.name);
      console.log(data);
      try {
        api.post('/transactions/import', data);
      } catch (err) {
        console.log(err.response.error);
      }
    });

    history.goBack();
  }

  function submitFile(files: File[]): void {
    const filesProps: FileProps[] = [];
    files.map(file => {
      filesProps.push({
        file,
        name: file.name,
        readableSize: filesize(file.size),
      });
    });

    setUploadedFiles([...uploadedFiles, ...filesProps]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              uploadedFile
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
