#!/bin/bash
# Create a temporary file
cp src/pages/Chat.tsx src/pages/Chat.tsx.tmp

# Replace the error handling section with the correct code
cat > src/pages/Chat.tsx.fixed << 'EOL'
            ...prev[aiMessageIndex],
            text: errorMessage,
            isStreaming: false
          }
        ]);
        
        // Stop the typing indicator for errors too
        setIsTyping(false);
        
        console.error('API Error:', errorMessage);
      }
    } catch (err: any) {
      // Get error message from error object if available
      const errorMessage = err?.response?.data?.message || 
                          'An error occurred while communicating with the AI';
      
      // Calculate aiMessageIndex in the catch block as well
      const aiMessageIndex = messages.length + 1;
      
      // Update the placeholder with the error message as AI response
      setMessages(prev => [
        ...prev.slice(0, aiMessageIndex),
        {
          ...prev[aiMessageIndex],
          text: errorMessage,
          isStreaming: false
        }
      ]);
      
      // Stop the typing indicator for errors too
      setIsTyping(false);
      
      console.error('Error:', err);
EOL

# Extract the start and end of the file
head -n 394 src/pages/Chat.tsx.tmp > src/pages/Chat.tsx
cat src/pages/Chat.tsx.fixed >> src/pages/Chat.tsx
tail -n +435 src/pages/Chat.tsx.tmp >> src/pages/Chat.tsx

# Clean up temporary files
rm src/pages/Chat.tsx.tmp src/pages/Chat.tsx.fixed
