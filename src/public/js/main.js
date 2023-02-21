const socket = io.connect();

let deleteButtons;
let editButtons;

async function enviarDatos() {
	const nombre = document.getElementById("title");
	const desc = document.getElementById("description");
	const code = document.getElementById("code");
	const price = document.getElementById("price");
	const status = document.getElementById("status");
	const stock = document.getElementById("stock");
	const category = document.getElementById("category");
	const urlfoto = document.getElementById("url");
	const producto = {
		title: nombre.value,
		description: desc.value,
		code: code.value,
		price: +price.value,
		status: status.checked,
		stock: +stock.value,
		category: category.value,
	};

	try {
		const response = await fetch("/api/products", {
			method: "POST",
			body: JSON.stringify({ product: producto }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log("Success:", data);
		nombre.value = "";
		desc.value = "";
		code.value = "";
		price.value = "";
		status.checked = true;
		stock.value = "";
		category.value = "";
		urlfoto.value = "";
		socket.emit("new-product");
	} catch (error) {
		console.error("Error:", error);
	}
}

function updateProduct(e) {
	e.preventDefault();

	let campos = e.target.id.split(":");
	let id = campos[1];
	let nombre = campos[2];
	let precio = campos[3];
	let newName = document.getElementById("title_update").value.trim();
	let newPrice = parseFloat(
		document.getElementById("price_update").value.trim()
	);

	// Validación de entrada
	if (!newName || isNaN(newPrice)) {
		alert("Ingrese un nombre y un precio válidos");
		return;
	}

	// Obtengo los valores del nombre y el precio del producto
	nombre = newName ? newName : nombre;
	precio = newPrice ? newPrice : precio;

	fetch(`/api/products/${id}`, {
		method: "PUT",
		body: JSON.stringify({ product: { id: id, title: nombre, price: precio } }),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			if (response.ok) {
				// Si la actualización fue exitosa, emite un evento en el socket
				socket.emit("new-product");
			} else {
				// Si la actualización falló, arroja un error
				throw new Error("Error actualizando producto");
			}
		})
		.catch((error) => {
			// Si ocurrió un error, muestra un mensaje de error al usuario
			console.error(error);
			alert("Error actualizando producto");
		});
}

function deleteProduct(id) {
	// Muestra un mensaje de espera al usuario
	console.log("Eliminando producto...");

	fetch(`/api/products/${id}`, {
		method: "DELETE",
	})
		.then((response) => {
			if (response.ok) {
				// Si la eliminación fue exitosa, muestra un mensaje al usuario y emite un evento en el socket
				console.log("Producto eliminado");
				socket.emit("new-product");
			} else {
				// Si la eliminación falló, arroja un error
				throw new Error("Error eliminando producto");
			}
		})
		.catch((error) => {
			// Si ocurrió un error, muestra un mensaje de error al usuario
			console.error(error);
			alert("Error eliminando producto");
		});
}

function createFormUpdateProduct(id, nombre, precio) {
	let formulario = `<form class="row g-3">
                      <div class="col-12">
                          <label for="id_update" class="form-label">Id</label>
                          <input type="text" class="form-control" id="id_update" value="${id}" disabled>
                      </div>
                      <div class="col-12">
                          <label for="title_update" class="form-label">Nombre</label>
                          <input type="text" class="form-control" id="title_update" value="${nombre}">
                      </div>
                      <div class="col-12">
                          <label for="price_update" class="form-label">Precio</label>
                          <input type="number" class="form-control" id="price_update" value="${precio}">
                      </div>
                    </form>`;
	let botones = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="update:${id}:${nombre}:${precio}">Guardar</button>`;
	const modal_body = document.getElementById("modal_id");
	modal_body.innerHTML = formulario;
	const modal_footer = document.getElementById("id_modal_footer");
	modal_footer.innerHTML = botones;
	let button_update = document.getElementById(
		`update:${id}:${nombre}:${precio}`
	);
	button_update.addEventListener("click", updateProduct);
}

function clickEnEdit(e) {
	let campos = e.target.id.split(":");
	let id = campos[0].slice(2);
	let nombre = campos[1];
	let precio = campos[2];
	createFormUpdateProduct(id, nombre, precio);
}

function clickEnBorrar(e) {
	let id = e.target.id.slice(2);
	deleteProduct(id);
}

function addActionsToButtons() {
	deleteButtons = document.querySelectorAll(".borrar");
	editButtons = document.querySelectorAll(".cambiar");

	for (let i = 0; i < deleteButtons.length; i++) {
		deleteButtons[i].addEventListener("click", clickEnBorrar);
	}

	for (let i = 0; i < editButtons.length; i++) {
		editButtons[i].addEventListener("click", clickEnEdit);
	}
}

const boton = document.getElementById("enviar");
boton?.addEventListener("click", enviarDatos);
addActionsToButtons();

socket.on("all_productos", (productos) => {
	const divProd = document.getElementById("productos");
	let html = "";

	if (productos.length > 0) {
		html = `
        <table class="table bg-dark">
          <thead>
            <tr>
              <th class="text-primary">Nombre</th>
              <th class="text-primary">Precio</th>
              <th class="text-primary">Imagen</th>
              <th class="text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
      `;

		productos.forEach((producto) => {
			html += `
          <tr>
            <td class="text-white">${producto.title}</td>
            <td class="text-white">${producto.price}</td>
            <td class="text-white"><img src="${producto.thumbnails[0]}" alt="imagen" height="64"></td>
            <td class="text-white">
              <div class="actions cambiar" id="xa${producto.id}">
                <img src="./images/edit.png" alt="editar" class="img-top" height="32" id="xc${producto.id}:${producto.title}:${producto.price}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              </div>
              <div class="actions borrar" id="xt${producto.id}">
                <img src="./images/delete.png" alt="borrar" id="xb${producto.id}" height="32">
              </div>
            </td>
          </tr>
        `;
		});

		html += `
          </tbody>
        </table>
      `;
		divProd.innerHTML = html;
		addActionsToButtons();
	} else {
		html = `<p class="mt-3 mb-3 p-3">No se encontraron productos</p>`;
		divProd.innerHTML = html;
	}
});
