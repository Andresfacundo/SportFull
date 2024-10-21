import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import avatar_male_1 from "../../../assets/Images/Avatars/Males/avatar_male_1.png";
import avatar_male_2 from "../../../assets/Images/Avatars/Males/avatar_male_2.png";
import avatar_male_3 from "../../../assets/Images/Avatars/Males/avatar_male_3.png";
import avatar_male_4 from "../../../assets/Images/Avatars/Males/avatar_male_4.png";
import avatar_male_5 from "../../../assets/Images/Avatars/Males/avatar_male_5.png";
import avatar_male_6 from "../../../assets/Images/Avatars/Males/avatar_male_6.png";
// Importa los demás avatares masculinos y femeninos
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
  const navigate = useNavigate();

  // Avatares masculinos y femeninos
  const maleAvatars = [
    avatar_male_1,
    avatar_male_2,
    avatar_male_3,
    avatar_male_4,
    avatar_male_5,
    avatar_male_6 /* añade los otros 6 avatares masculinos aquí */,
  ];
  const femaleAvatars = [
    avatar_female_1,
    avatar_female_2,
    avatar_female_3,
    avatar_female_4,
    avatar_female_5,
    avatar_female_6 /* añade los otros 6 avatares femeninos aquí */,
    ,
  ];

  const handleDrop = (acceptedFiles) => {
    setImage(URL.createObjectURL(acceptedFiles[0]));
    setAvatar(null); // Descartar cualquier avatar seleccionado
  };

  const handleAvatarClick = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setImage(null); // Descartar cualquier imagen cargada
  };

  const handleSave = () => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImage = canvasScaled.toDataURL();
      setProfileImage(croppedImage); // Actualizamos la imagen de perfil en Header
      navigate("/ActualizarCliente"); // Redirigimos a /ActualizarCliente
    }
  };

  let editor = null;

  return (
    <div className="edit-profile-container">
      <h2>Edita tu foto de perfil</h2>

      {/* Dropzone para cargar una imagen desde el ordenador */}
      <Dropzone onDrop={handleDrop} accept="image/*">
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Arrastra una imagen o haz clic para seleccionar una</p>
          </div>
        )}
      </Dropzone>

      {/* Editor de imagen o avatar */}
      {image || avatar ? (
        <AvatarEditor
          ref={(ref) => (editor = ref)}
          image={image || avatar} // Usamos la imagen o avatar seleccionada
          width={250}
          height={250}
          border={50}
          borderRadius={125}
          color={[255, 255, 255, 0.6]} // Color del borde (RGBA)
          scale={scale} // Escala del recorte
          rotate={0}
        />
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