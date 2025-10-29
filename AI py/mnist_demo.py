# Import TensorFlow and Keras
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# 1️⃣ Load the dataset (handwritten digits)
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()

# 2️⃣ Normalize the data (make pixel values between 0 and 1)
X_train = X_train / 255.0
X_test = X_test / 255.0

# 3️⃣ Build the Sequential model
model = keras.Sequential([
    layers.Flatten(input_shape=(28, 28)),      # Turn each image (28x28) into a 1D list of 784 numbers
    layers.Dense(128, activation='relu'),      # Hidden layer with 128 neurons
    layers.Dense(10, activation='softmax')     # Output layer for 10 digits (0–9)
])

# 4️⃣ Compile the model (choose how it learns)
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',    # good for integer labels (0–9)
    metrics=['accuracy']                       # track accuracy during training
)

# 5️⃣ Train the model
print("Training the model... please wait ⏳")
history = model.fit(X_train, y_train, epochs=5, batch_size=32, validation_data=(X_test, y_test))

# 6️⃣ Evaluate the model on test data
test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\n✅ Test Accuracy: {test_accuracy * 100:.2f}%")
print(f"❌ Test Loss: {test_loss:.4f}")
