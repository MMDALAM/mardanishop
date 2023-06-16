const express = require("express");
const router = express.Router();

//controller
const adminController = require("app/http/controllers/admin/adminController");
const clintController = require("app/http/controllers/admin/clintController");
const productsController = require("app/http/controllers/admin/productsController");
const factorController = require("app/http/controllers/admin/factorController");
const lineController = require("app/http/controllers/admin/lineController");
const purchaseInvoiceController = require("app/http/controllers/admin/purchaseInvoiceController");

//Validator
const clintValidator = require("app/http/validators/clintValidator");
const productsValidator = require("app/http/validators/productsValidator");
const factorValidator = require("app/http/validators/factorValidator");
const lineValidator = require("app/http/validators/lineValidator");
const productValidator = require("app/http/validators/productValidator");
const productsEditedReduceValidator = require("app/http/validators/productsEditedReduceValidator");
const purchaseInvoiceValidator = require("app/http/validators/purchaseInvoiceValidator");

//middleware
const convertFileToField = require("app/http/middleware/convertFileToField");

//helpers
const uploadImage = require("app/helpers/uploadImage");

//Admin Routes
router.get("/", adminController.showAdmin);

//clint Routes
router.get("/clint", clintController.showClint);

router.get("/creatClient", clintController.creatClient);
router.post(
  "/creatClient",
  clintValidator.handle(),
  clintController.clintProccess
);

router.get("/clints", clintController.clints);
router.get("/clintsCreditor", clintController.clintsCreditor);
router.get("/factorClint/:id", clintController.factorClint);
router.get("/factorClintCreditor/:id", clintController.factorClintCreditor);

router.get("/editeClint/:id", clintController.showEditeClint);
router.post(
  "/editeClint/:id",
  clintValidator.handle(),
  clintController.editeClint
);

router.get("/debtorClint/:id", clintController.debtorClint);
router.get("/paymentReceipt/:id", clintController.paymentReceipt);
router.get("/creditorClint/:id", clintController.creditorClint);
router.get("/paymentDebtorClint/:id", clintController.paymentDebtorClint);
router.post("/paymentDebtorClint/:id", clintController.debtorClintProccess);
router.get("/paymentCreditorClint/:id", clintController.paymentCreditorClint);
router.post("/paymentCreditorClint/:id", clintController.creditorClintProccess);

router.get("/deleteClint/:id", clintController.deleteClint);

//product Routes
router.get("/products", productsController.products);
router.get("/allProducts", productsController.allProducts);
router.get("/creatProducts", productsController.creatProducts);
router.post(
  "/creatProducts",
  productsValidator.handle(),
  productsController.productsProccess
);

router.post(
  "/singelProducts",
  productValidator.handle(),
  productsController.singelProducts
);

router.get("/singelProducts/edite/:id", productsController.showEditeProducts);
router.post(
  "/singelProducts/edited/:id",
  productsValidator.handle(),
  productsController.editeProducts
);
router.post(
  "/singelProducts/editedReduce/:id",
  productsEditedReduceValidator.handle(),
  productsController.editedReduce
);

router.post("/singelProducts/delete/:id", productsController.deleteProducts);

//factor Routes
router.get("/factor", factorController.showFactor);
router.post(
  "/factor",
  factorValidator.handle(),
  factorController.factorProccess
);

router.get("/createFactor/:id", factorController.createFactor);
router.post("/createFactor/:id", factorController.saveFactorProccess);

router.get("/singelFactor/:id", factorController.singelFactor);

router.get("/deleteFactor/:id", factorController.deleteFactor);
router.get("/deleteFactors/:id", factorController.deleteFactors);

router.post("/discount/:id", factorController.discount);

//print
router.get("/printFactorBig/:id", factorController.printFactorBig);
router.get("/printFactorLarge/:id", factorController.printFactorLarge);
router.get("/printFactorSmall/:id", factorController.printFactorSmall);
router.get("/typeFactor/:id", factorController.typeFactor);

//purchaseInvoice
router.get("/purchaseInvoice", purchaseInvoiceController.index);
router.get(
  "/showPurchaseInvoice",
  purchaseInvoiceController.showPurchaseInvoice
);
router.post(
  "/showPurchaseInvoicePart",
  purchaseInvoiceController.showPurchaseInvoicePart
);

router.get(
  "/showPurchaseInvoice/:id",
  purchaseInvoiceController.purchaseInvoice
);
router.get("/uploadFactorInv", purchaseInvoiceController.uploadFactorInv);
router.post(
  "/proccessFactorInv",
  uploadImage.single("images"),
  convertFileToField.handle,
  purchaseInvoiceValidator.handle(),
  purchaseInvoiceController.proccessFactorInv
);
router.get(
  "/deletePurchaseInv/:id",
  purchaseInvoiceController.deletePurchaseInv
);

//line Routes
// router.get('/line/:id', factorController.showFactor);
router.post("/line/:id", lineValidator.handle(), lineController.lineProccess);
router.post("/lineChange/:id", lineController.lineChange);
router.post("/line/delete/:id", lineController.lineDelete);

module.exports = router;
