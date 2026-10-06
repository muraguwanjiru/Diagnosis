import os
import io
import base64
import numpy as np
import tensorflow as tf
from PIL import Image

class AIModelEngine:
    def __init__(self):
        self.model = self._load_model_instance()

    def _load_model_instance(self):
        weights_path = os.getenv("MODEL_WEIGHTS_PATH", "apps/diagnos-backend/core/weights/densenet121_brain_mri.h5")
        
        base_model = tf.keras.applications.DenseNet121(
            include_top=False,
            weights="imagenet" if not os.path.exists(weights_path) else None,
            input_shape=(224, 224, 3),
            pooling="avg"
        )
        
        outputs = tf.keras.layers.Dense(4, activation="softmax")(base_model.output)
        model = tf.keras.Model(inputs=base_model.input, outputs=outputs)
        
        if os.path.exists(weights_path):
            model.load_weights(weights_path)
            
        return model

    def preprocess_base64_image(self, base64_string: str) -> np.ndarray:
        """Decodes a long Base64 string directly into a TensorFlow ready array."""
        # 1. Strip off the metadata prefix if the frontend sends it (e.g., 'data:image/jpeg;base64,')
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
            
        # 2. Decode the text characters back into raw binary bytes
        image_bytes = base64.b64decode(base64_string)
        
        # 3. Process the bytes into a clean image array
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Normalize for DenseNet121 requirements
        preprocessed_array = tf.keras.applications.densenet.preprocess_input(img_array)
        return preprocessed_array

    def predict(self, numpy_input: np.ndarray) -> list:
        probabilities = self.model.predict(numpy_input, verbose=0)
        return probabilities.squeeze().tolist()

ai_engine = AIModelEngine()
