import subprocess
import threading
import sys
import os
import platform
import time

def stream_output(process, prefix, color_code):
    try:
        encoding = sys.stdout.encoding or "utf-8"
        for line in iter(process.stdout.readline, b''):
            decoded = line.decode('utf-8', errors='replace').rstrip()
            # Safely replace characters that cannot be encoded by the current console encoding (e.g. cp1252)
            safe_decoded = decoded.encode(encoding, errors='replace').decode(encoding)
            print(f"\033[{color_code}m{prefix}\033[0m {safe_decoded}")
    except Exception as e:
        print(f"Error reading output from {prefix}: {e}")
    finally:
        try:
            process.stdout.close()
        except:
            pass

def kill_process(proc):
    if not proc:
        return
    try:
        if platform.system() == "Windows":
            # taskkill with /T kills the process and all child processes it started (avoids orphan processes)
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], 
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            proc.terminate()
            proc.wait(timeout=3)
    except Exception as e:
        try:
            proc.kill()
        except:
            pass

def main():
    # Configure stream output error handling to avoid crashes on unsupported characters
    try:
        sys.stdout.reconfigure(errors='replace')
        sys.stderr.reconfigure(errors='replace')
    except:
        pass

    # Enable Windows virtual terminal processing for ANSI escape sequences (colors)
    if platform.system() == "Windows":
        try:
            import ctypes
            kernel32 = ctypes.windll.kernel32
            kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
        except:
            pass

    print("\033[94m[System] Starting Kuboptix Development Services...\033[0m")
    
    # 1. Start Backend (Go) on port 8000
    print("\033[93m[System] Launching Go Kubernetes Backend (Port 8000)...\033[0m")
    backend_cmd = "go run main.go"
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd="backend-go",
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )

    # 2. Start Frontend (Next.js) on port 3000
    print("\033[96m[System] Launching Next.js Frontend (Port 3000)...\033[0m")
    frontend_cmd = "npm run dev"
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )

    # 3. Start Threads for streaming output
    backend_thread = threading.Thread(
        target=stream_output, 
        args=(backend_proc, "[Backend]", "93"), 
        daemon=True
    )
    frontend_thread = threading.Thread(
        target=stream_output, 
        args=(frontend_proc, "[Frontend]", "96"), 
        daemon=True
    )

    backend_thread.start()
    frontend_thread.start()

    print("\033[92m[System] Services are running. Press Ctrl+C to terminate both servers.\033[0m")

    try:
        while True:
            if backend_proc.poll() is not None:
                print("\033[91m[System] Backend process exited unexpectedly.\033[0m")
                break
            if frontend_proc.poll() is not None:
                print("\033[91m[System] Frontend process exited unexpectedly.\033[0m")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\033[94m[System] Shutdown signal received. Terminating services...\033[0m")
    finally:
        kill_process(backend_proc)
        kill_process(frontend_proc)
        print("\033[92m[System] Cleanup complete. Goodbye!\033[0m")

if __name__ == "__main__":
    main()
