package com.example.sport_full.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
<<<<<<< HEAD
=======
import org.hibernate.annotations.Where;

>>>>>>> develop
import java.io.Serializable;

@Entity
@Table(name = "Perfil_cliente")
public class ClientModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
<<<<<<< HEAD
    private Long id;  // Cambiado de int a Long
=======
    private Long id;
>>>>>>> develop

    @Column(nullable = true, unique = true)
    private String CC;

<<<<<<< HEAD
    @Column(nullable = true, unique = true)
=======
    @Column(nullable = true)  // Hacer opcionales las columnas
>>>>>>> develop
    private String telefono;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "usuario_id", referencedColumnName = "id",unique = true)
    private UserModels userModels;

    @Lob
    @Column(name = "img_perfil", columnDefinition = "LONGBLOB", nullable = true)
    private byte[] imgPerfil;


    // Getters y Setters
<<<<<<< HEAD
=======

>>>>>>> develop
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCC() {
        return CC;
    }

    public void setCC(String CC) {
        this.CC = CC;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public UserModels getUserModels() {
        return userModels;
    }

    public void setUserModels(UserModels userModels) {  // Método que faltaba
        this.userModels = userModels;
    }

    public byte[] getImgPerfil() {
        return imgPerfil;
    }

    public void setImgPerfil(byte[] imgPerfil) {
        this.imgPerfil = imgPerfil;
    }
}

