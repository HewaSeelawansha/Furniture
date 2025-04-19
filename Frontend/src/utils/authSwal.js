import Swal from 'sweetalert2';

export const handleSuccess = (msg) => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: msg,
        showConfirmButton: false,
        timer: 1500,
      });
}

export const handleError = (msg) => {
    Swal.fire({
        position: "top-end",
        icon: "warning",
        title: msg,
        showConfirmButton: false,
        timer: 1500,
      });
}

export const handleConfirmation = (confm, confb, msg) => {
    Swal.fire({
      title: confm,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confb
    }).then((result) => {
      if (result.isConfirmed) {
        return Swal.fire({
          title: msg,
          icon: "success"
        }).then(() => true);
      }
      return false;
    });
}