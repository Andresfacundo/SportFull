package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.FieldModels;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IFieldRepository;
import com.example.sport_full.repositories.IReservationsRepository;
import com.example.sport_full.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationsServices {

    @Autowired
    IReservationsRepository reservationsRepository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    IFieldRepository fieldRepository;

    @Autowired
    ICompanyRepository companyRepository;

    public List<ReservationsModels> getAllReservations() {
        return reservationsRepository.findAll();
    }

    public ReservationsModels createReservation(ReservationsModels reservation) {
        return reservationsRepository.save(reservation);
    }

    public Optional<ReservationsModels> getReservationById(Long id) {
        return reservationsRepository.findById(id);
    }

}
