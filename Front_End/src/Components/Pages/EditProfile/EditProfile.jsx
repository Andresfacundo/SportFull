import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import "./EditProfile.css";
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

export const EditProfile = ({ setProfileImage }) => {
  const [image, setImage] = useState(null); // Imagen cargada desde el ordenador
  const [avatar, setAvatar] = useState(null); // Avatar seleccionado
  const [scale, setScale] = useState(1); // Escala para el recorte
  const [croppedImage, setCroppedImage] = useState(null); // Imagen recortada
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();

  const maleAvatars = [
    avatar_male_1,
    avatar_male_2,
    avatar_male_3,
    avatar_male_4,
    avatar_male_5,
    avatar_male_6,
  ];
  const femaleAvatars = [
    avatar_female_1,
    avatar_female_2,
    avatar_female_3,
    avatar_female_4,
    avatar_female_5,
    avatar_female_6,
  ];

  const handleDrop = (acceptedFiles) => {
    try {
      // Validamos que el archivo sea de tipo JPG o PNG
      const file = acceptedFiles[0];

      if (
        !file.type.includes("image/jpeg") &&
        !file.type.includes("image/png")
      ) {
        throw new Error(
          "Archivo no soportado. Solo se permiten archivos JPG o PNG."
        );
      }

      // Si el archivo es válido, lo cargamos
      setImage(URL.createObjectURL(file));
      setAvatar(null); // Descartar cualquier avatar seleccionado
      setErrorMessage(null); // Limpiar mensaje de error si había uno
    } catch (error) {
      setErrorMessage(error.message); // Mostramos el mensaje de error capturado
      setImage(null); // Evitamos que se cargue la imagen no válida
    }
  };

  const handleDropRejected = (rejectedFiles) => {
    // Si el archivo es rechazado, mostramos el mensaje de error
    if (rejectedFiles && rejectedFiles.length > 0) {
      setErrorMessage(
        "Archivo no soportado. Solo se permiten archivos JPG o PNG."
      );
    }
    setImage(null); // Asegúrate de que no se permita editar archivos no válidos
  };

  const handleAvatarClick = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setImage(null); // Descartar cualquier imagen cargada
    setErrorMessage(""); // Limpiar el mensaje de error
  };

  const handleSave = () => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const cropped = canvasScaled.toDataURL();
      setProfileImage(cropped); // Actualizamos la imagen de perfil en Header
      navigate("/ActualizarCliente"); // Redirigimos a /ActualizarCliente
    }
  };

  const handleUpdatePreview = () => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const cropped = canvasScaled.toDataURL();
      setCroppedImage(cropped); // Guardamos la imagen recortada para vista previa
    }
  };

  let editor = null;

  return (
    <div className="edit-profile-container">
      <h2>Edita tu foto de perfil</h2>

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

      {/* Dropzone para cargar una imagen desde el ordenador */}
      <Dropzone onDrop={handleDrop} maxFiles={1} accept="image/jpeg, image/png">
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>
              Arrastra una imagen o haz clic para seleccionar una (solo JPG/PNG)
            </p>
          </div>
        )}
      </Dropzone>

      {/* Mostrar el mensaje de error si existe */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Editor de imagen o avatar */}
      {image || avatar ? (
        <div>
          <AvatarEditor
            ref={(ref) => (editor = ref)}
            image={image || avatar} // Usamos la imagen o avatar seleccionada
            width={250}
            height={250}
            border={10}
            borderRadius={250}
            color={[255, 255, 255, 0.6]} // Color del borde (RGBA)
            scale={scale} // Escala del recorte
            rotate={0}
          />

          {/* Botón para actualizar vista previa */}
          <button onClick={handleUpdatePreview} className="preview-button">
            Actualizar vista previa
          </button>
        </div>
      ) : (
        <p>No se ha seleccionado ninguna imagen</p>
      )}

      {/* Control de escala (zoom) solo cuando se haya seleccionado una imagen o avatar */}
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

      {/* Selección de avatares masculinos */}
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

      {/* Selección de avatares femeninos */}
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

      {/* Botón para guardar los cambios */}
      <button onClick={handleSave} className="save-button">
        Guardar imagen
      </button>
    </div>
  );
};

export default EditProfile;
