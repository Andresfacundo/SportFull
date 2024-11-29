package com.example.sport_full.controllers;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.FieldModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IFieldRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.FieldServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/fields")
public class FieldControllers {

    private final IFieldRepository fieldRepository;
    private final IUserRepository userRepository;
    @Autowired
    private FieldServices fieldService;

    private final ICompanyRepository companyRepository;

    @Autowired
    public FieldControllers(IFieldRepository fieldRepository, IUserRepository userRepository, ICompanyRepository companyRepository) {
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }

    // Crear una nueva cancha
    @PostMapping("/create")
    public ResponseEntity<?> createField(
            @RequestBody FieldModels fieldModels,
            @RequestParam Long empresaId) {

        Optional<UserModels> userOptional = userRepository.findById(empresaId);

        if (userOptional.isPresent()) {
            UserModels user = userOptional.get();

            // Verificar si el usuario es de tipo EMPRESA
            if (!"EMPRESA".equalsIgnoreCase(user.getTipoUsuario())) {
                return new ResponseEntity<>("El usuario no es de tipo EMPRESA", HttpStatus.UNAUTHORIZED);
            }

            AdminModels admin = user.getAdminModels();
            List<String> adminServices = admin.getServiciosGenerales();
            List<String> selectedServices = fieldModels.getServicios();

            // Validar que los servicios seleccionados pertenezcan a los servicios generales de la empresa
            for (String servicio : selectedServices) {
                if (!adminServices.contains(servicio)) {
                    return new ResponseEntity<>("El servicio seleccionado no pertenece a los servicios generales de la empresa", HttpStatus.BAD_REQUEST);
                }
            }

            // Asignar la empresa (admin) a la cancha y guardar los servicios seleccionados
            fieldModels.setAdminModels(admin);
            FieldModels savedField = fieldRepository.save(fieldModels);

            return new ResponseEntity<>(savedField, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Empresa no encontrada", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/findAll")
    public List<Map<String, Object>> getAllFields() {
        List<FieldModels> fields = fieldService.getAllFields();
        List<Map<String, Object>> response = new ArrayList<>();

        for (FieldModels field : fields) {
            Map<String, Object> fieldMap = new HashMap<>();
            fieldMap.put("id", field.getId());
            fieldMap.put("nombre", field.getNombre());
            fieldMap.put("precio", field.getPrecio());
            fieldMap.put("estado", field.getEstado());
            fieldMap.put("tipoCancha", field.getTipoCancha());
            fieldMap.put("servicios", field.getServicios());


            // Incluimos el nombre de la empresa de AdminModels solo una vez
            if (field.getAdminModels() != null) {
                fieldMap.put("nombreEmpresa", field.getAdminModels().getNombreEmpresa());
                fieldMap.put("horaApertura", field.getAdminModels().getHoraApertura());
                fieldMap.put("horaCierre", field.getAdminModels().getHoraCierre());
                fieldMap.put("diasApertura", field.getAdminModels().getDiasApertura());
                fieldMap.put("empresaId", field.getAdminModels().getId());


            }

            response.add(fieldMap);
        }
        return response;
    }

    // Consultar cancha por ID
    @GetMapping("/findById/{id}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable Long id) {
        Optional<FieldModels> campoOpt = fieldRepository.findById(id);

        if (campoOpt.isPresent()) {
            FieldModels campo = campoOpt.get();

            // Crea un mapa para la respuesta
            Map<String, Object> response = new HashMap<>();

            // Agregar los datos de diasApertura directamente al mapa
            response.put("diasApertura", campo.getAdminModels().getDiasApertura());
            response.put("horaApertura", campo.getAdminModels().getHoraApertura());
            response.put("horaCierre", campo.getAdminModels().getHoraCierre());


            // Agregar los campos de FieldModels directamente al mapa
            response.put("id", campo.getId());
            response.put("nombre", campo.getNombre());
            response.put("precio", campo.getPrecio());
            response.put("estado", campo.getEstado());
            response.put("servicios", campo.getServicios());
            response.put("tipoCancha", campo.getTipoCancha());

            return ResponseEntity.ok(response);  // Retorna el mapa con los datos
        } else {
            return ResponseEntity.notFound().build(); // Devuelve un 404 si no se encuentra la cancha
        }
    }


    @GetMapping("/list")
    public ResponseEntity<?> listFields(@RequestParam Long empresaId) {
        Optional<AdminModels> empresaOptional = companyRepository.findById(empresaId);

        if (empresaOptional.isPresent()) {
            AdminModels empresa = empresaOptional.get();

            // Obtener las canchas asociadas a esta empresa
            List<FieldModels> fields = fieldRepository.findByAdminModels_Id(empresaId);

            if (fields.isEmpty()) {
                return new ResponseEntity<>("No hay canchas asociadas a esta empresa", HttpStatus.OK);
            }

            return new ResponseEntity<>(fields, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Empresa no encontrada", HttpStatus.NOT_FOUND);
        }
    }


    // Actualizar una cancha
    @PutMapping("/update")
    public ResponseEntity<?> updateField(@RequestParam Long fieldId, @RequestBody FieldModels fieldDetails, @RequestParam Long empresaId) {
        Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);
        Optional<UserModels> userOptional = userRepository.findById(empresaId);

        if (fieldOptional.isPresent() && userOptional.isPresent()) {
            UserModels user = userOptional.get();

            if (!"EMPRESA".equalsIgnoreCase(user.getTipoUsuario())) {
                return new ResponseEntity<>("El usuario no es de tipo EMPRESA", HttpStatus.UNAUTHORIZED);
            }

            FieldModels fields = fieldOptional.get();

//          verificar que la cancha pertenece a la empresa
            // Verificar que la cancha pertenece a la empresa
            if (!fields.getAdminModels().getId().equals(user.getId())) {
                return new ResponseEntity<>("La cancha no pertenece a esta empresa", HttpStatus.UNAUTHORIZED);
            }

            FieldModels field = fieldOptional.get();
            field.setNombre(fieldDetails.getNombre());
            field.setPrecio(fieldDetails.getPrecio());
            field.setEstado(fieldDetails.getEstado());
            field.setTipoCancha(fieldDetails.getTipoCancha());
            field.setServicios(fieldDetails.getServicios());

            fieldRepository.save(field);
            return new ResponseEntity<>(field, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Campo o empresa no encontrados", HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar una cancha
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteField(@RequestParam Long fieldId, @RequestParam Long empresaId) {
        // Buscar la cancha por su ID
        Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);
        // Buscar la empresa por su ID
        Optional<AdminModels> adminOptional = companyRepository.findById(empresaId);

        // Validar si la cancha y la empresa existen
        if (fieldOptional.isPresent() && adminOptional.isPresent()) {
            AdminModels admin = adminOptional.get();
            FieldModels field = fieldOptional.get();

            // Verificar que la cancha pertenece a la empresa
            if (!field.getAdminModels().getId().equals(admin.getId())) {
                return new ResponseEntity<>("La cancha no pertenece a esta empresa", HttpStatus.UNAUTHORIZED);
            }

            // Eliminar la cancha
            fieldRepository.deleteById(fieldId);
            return new ResponseEntity<>("Campo eliminado correctamente", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Campo o empresa no encontrados", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/servicios")
    public ResponseEntity<?> getFieldServices(@RequestParam Long fieldId) {
        Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);

        if (fieldOptional.isPresent()) {
            FieldModels field = fieldOptional.get();
            return new ResponseEntity<>(field.getServicios(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Campo no encontrado", HttpStatus.NOT_FOUND);
        }
    }

    // Añadir servicio a una cancha
    @PostMapping("/servicios/add")
    public ResponseEntity<?> addServiceToField(@RequestParam Long fieldId, @RequestParam String servicio) {
        Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);

        if (fieldOptional.isPresent()) {
            FieldModels field = fieldOptional.get();
            field.getServicios().add(servicio); // Añadir servicio
            fieldRepository.save(field); // Guardar cambios
            return new ResponseEntity<>(field.getServicios(), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Campo no encontrado", HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un servicio de una cancha
    @DeleteMapping("/servicios/delete")
    public ResponseEntity<?> deleteServiceFromField(@RequestParam Long fieldId, @RequestParam String servicio) {
        Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);

        if (fieldOptional.isPresent()) {
            FieldModels field = fieldOptional.get();
            field.getServicios().remove(servicio); // Eliminar servicio
            fieldRepository.save(field); // Guardar cambios
            return new ResponseEntity<>(field.getServicios(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Campo no encontrado", HttpStatus.NOT_FOUND);
        }
    }

}