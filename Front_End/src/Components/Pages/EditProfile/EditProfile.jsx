import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import "./EditProfile.css";
import { Header } from "../../../Components/Layouts/Header/Header";
import fondo_long from "../../../assets/Images/fondos/fondo_long.png";
import { useNavigate } from "react-router-dom";
import avatar_male_1 from "../../../assets/Images/Avatars/Males/avatar_male_01.png";
import avatar_male_2 from "../../../assets/Images/Avatars/Males/avatar_male_2.png";
import avatar_male_3 from "../../../assets/Images/Avatars/Males/avatar_male_3.png";
import avatar_male_4 from "../../../assets/Images/Avatars/Males/avatar_male_4.png";
import avatar_male_5 from "../../../assets/Images/Avatars/Males/avatar_male_5.png";
import avatar_male_6 from "../../../assets/Images/Avatars/Males/avatar_male_6.png";
import avatar_female_1 from "../../../assets/Images/Avatars/Females/avatar_female_1.png";
import avatar_female_2 from "../../../assets/Images/Avatars/Females/avatar_female_2.png";
import avatar_female_3 from "../../../assets/Images/Avatars/Females/avatar_female_3.png";
import avatar_female_4 from "../../../assets/Images/Avatars/Females/avatar_female_4.png";
import avatar_female_5 from "../../../assets/Images/Avatars/Females/avatar_female_5.png";
import avatar_female_6 from "../../../assets/Images/Avatars/Females/avatar_female_6.png";
import ClienteServices from "../../../services/ClienteService"; // Asegúrate de que la ruta sea correcta

export const EditProfile = ({ setProfileImage }) => {
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [scale, setScale] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  let editor = null;

  const maleAvatars = [
    avatar_male_1, avatar_male_2, avatar_male_3, avatar_male_4, avatar_male_5, avatar_male_6
  ];
  const femaleAvatars = [
    avatar_female_1, avatar_female_2, avatar_female_3, avatar_female_4, avatar_female_5, avatar_female_6
  ];

  const handleDrop = (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      if (!file.type.includes("image/jpeg") && !file.type.includes("image/png")) {
        throw new Error("Archivo no soportado. Solo se permiten archivos JPG o PNG.");
      }
      setImage(URL.createObjectURL(file));
      setAvatar(null);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
      setImage(null);
    }
  };

  const handleDropRejected = (rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      setErrorMessage("Archivo no soportado. Solo se permiten archivos JPG o PNG.");
    }
    setImage(null);
  };

  const handleAvatarClick = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setImage(null);
    setErrorMessage("");
  };

  const handleUpdatePreview = () => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const cropped = canvasScaled.toDataURL();
      setCroppedImage(cropped);
    }
  };

  const handleSave = async () => {
    if (croppedImage) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const tipoUsuario = user?.tipoUsuario;
        const empresaId = user?.adminModels?.id;
        const clienteId = user?.clientModels?.id;
        const gestorId = user?.gestorModels?.id;
  
        if (!tipoUsuario) {
          throw new Error("No se encontró el tipo de usuario.");
        }
  
        // Eliminar el prefijo "data:image/jpeg;base64," para obtener solo el contenido Base64
        const base64Image = croppedImage.split(',')[1];
  
        // Convertir el Base64 a Blob
        const byteString = atob(base64Image);
        const mimeString = croppedImage.split(',')[0].split(':')[1].split(';')[0];
        const buffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(buffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const file = new Blob([buffer], { type: mimeString });
  
        let response;
  
        // Determinar el método a ejecutar basado en el tipo de usuario
        if (tipoUsuario === "EMPRESA") {
          if (!empresaId) throw new Error("No se encontró el ID de la empresa.");
          response = await ClienteServices.updateCompanyImage(empresaId, file);
        } else if (tipoUsuario === "CLIENTE") {
          if (!clienteId) throw new Error("No se encontró el ID del cliente.");
          response = await ClienteServices.updateClientImage(clienteId, file);
        } else if (tipoUsuario === "GESTOR") {
          if (!gestorId) throw new Error("No se encontró el ID del gestor.");
          response = await ClienteServices.updateManagerImage(gestorId, file);
        } else {
          throw new Error("Tipo de usuario no válido.");
        }
  
        // Validar la respuesta
        if (response.status === 200) {
          // Actualizar la imagen en el estado global
          setImage(croppedImage);
  
          // Actualizar la imagen en el localStorage
          const updatedUser = { ...user };
  
          if (tipoUsuario === "EMPRESA") {
            updatedUser.adminModels = {
              ...user.adminModels,
              imgPerfil: base64Image, // Guardar solo el contenido Base64
            };
          } else if (tipoUsuario === "CLIENTE") {
            updatedUser.clientModels = {
              ...user.clientModels,
              imgPerfil: base64Image, // Guardar solo el contenido Base64
            };
          } else if (tipoUsuario === "GESTOR") {
            updatedUser.gestorModels = {
              ...user.gestorModels,
              imgPerfil: base64Image, // Guardar solo el contenido Base64
            };
          }
  
          localStorage.setItem('user', JSON.stringify(updatedUser)); // Guardar el usuario actualizado en el localStorage
  
          setSuccessMessage("Imagen actualizada con éxito.");
          navigate("/ActualizarCliente");
        } else {
          throw new Error("No se pudo actualizar la imagen.");
        }
      } catch (error) {
        setErrorMessage(error.message || "Ocurrió un error al actualizar la imagen.");
      }
    }
  };
  


  return (
    <div
      style={{
        backgroundImage: `url(${fondo_long})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        width: "100%",
      }}
      className="container"
    >
      <Header />
      <main className="editPhotoProfile">
        <h2>Editar foto de Perfil</h2>
        {/* Vista previa de la imagen recortada */}
      {croppedImage && (
        <div className="cropped-image-preview">
          <h3>Vista previa:</h3>
          <img
            src={croppedImage}
            alt="Cropped"
            style={{ borderRadius: "50%" }}
          />
        </div>
      )}

        <Dropzone onDrop={handleDrop} maxFiles={1} accept="image/jpeg, image/png">
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Arrastra una imagen o haz clic para seleccionar una (solo JPG/PNG)</p>
            </div>
          )}
        </Dropzone>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {image || avatar ? (
          <div>
            <AvatarEditor
              ref={(ref) => (editor = ref)}
              image={image || avatar}
              width={250}
              height={250}
              border={10}
              borderRadius={250}
              color={[255, 255, 255, 0.6]}
              scale={scale}
              rotate={0}
            />
            <button onClick={handleUpdatePreview} className="preview-button">Actualizar vista previa</button>
          </div>
        ) : (
          <p>No se ha seleccionado ninguna imagen</p>
        )}

        {image || avatar ? (
          <div>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
          </div>
        ) : null}

        <h3>Elige un avatar masculino</h3>
        <div className="avatar-selection">
          {maleAvatars.map((maleAvatar, index) => (
            <img
              key={index}
              src={maleAvatar}
              alt={`Male Avatar ${index}`}
              onClick={() => handleAvatarClick(maleAvatar)}
              className="avatar"
            />
          ))}
        </div>

        <h3>Elige un avatar femenino</h3>
        <div className="avatar-selection">
          {femaleAvatars.map((femaleAvatar, index) => (
            <img
              key={index}
              src={femaleAvatar}
              alt={`Female Avatar ${index}`}
              onClick={() => handleAvatarClick(femaleAvatar)}
              className="avatar"
            />
          ))}
        </div>

        <button onClick={handleSave} className="save-button">Guardar imagen</button>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </main>
    </div>
  );
};

export default EditProfile;
