import sys
import os
import threading
import subprocess
import time
from pathlib import Path
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.popup import Popup
from kivy.core.window import Window
from kivy.graphics import Color, Rectangle

REPO_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = REPO_ROOT / 'backend'
FRONTEND_DIR = REPO_ROOT / 'frontend'

Window.size = (1200, 800)


class JobPrepSetupApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = ''
        self.backend_proc = None
        self.frontend_proc = None
        self.output_widget = None
    
    def build(self):
        main_layout = BoxLayout(orientation='vertical', padding=15, spacing=10)
        
        # Header section
        header_layout = BoxLayout(size_hint_y=None, height=60, spacing=10, padding=(20, 0))
        title_label = Label(text='JobPrep Setup', font_size='32sp', bold=True)
        header_layout.add_widget(title_label)
        help_btn = Button(text='Help', size_hint_x=0.15, font_size='14sp')
        help_btn.bind(on_press=self.show_instructions)
        header_layout.add_widget(help_btn)
        main_layout.add_widget(header_layout)
        
        # Divider
        divider = Label(size_hint_y=None, height=2)
        with divider.canvas.before:
            Color(0.8, 0.8, 0.8, 1)
            Rectangle(pos=divider.pos, size=divider.size)
        main_layout.add_widget(divider)
        
        # API Key section
        api_container = BoxLayout(orientation='vertical', size_hint_y=None, height=120, spacing=8, padding=(10, 10))
        api_label = Label(text='Google AI API Key', size_hint_y=None, height=30, font_size='16sp', bold=True)
        api_container.add_widget(api_label)
        
        api_hint = Label(text='Get free from: https://ai.google.dev/ (optional)', size_hint_y=None, height=25, font_size='13sp')
        api_container.add_widget(api_hint)
        
        self.api_entry = TextInput(multiline=False, size_hint_y=None, height=45, hint_text='Paste your API key here or leave blank', font_size='13sp')
        api_container.add_widget(self.api_entry)
        main_layout.add_widget(api_container)
        
        # Divider
        divider2 = Label(size_hint_y=None, height=2)
        with divider2.canvas.before:
            Color(0.8, 0.8, 0.8, 1)
            Rectangle(pos=divider2.pos, size=divider2.size)
        main_layout.add_widget(divider2)
        
        # Control section
        control_layout = BoxLayout(orientation='vertical', size_hint_y=None, height=170, spacing=10, padding=(10, 10))
        
        control_label = Label(text='Server Control', size_hint_y=None, height=28, font_size='16sp', bold=True)
        control_layout.add_widget(control_label)
        
        # Buttons in 2x2 grid
        buttons_grid = GridLayout(cols=2, size_hint_y=None, height=110, spacing=10)
        
        btn1 = Button(text='Create .env Files', background_color=(0.2, 0.6, 0.8, 1), font_size='13sp')
        btn1.bind(on_press=self.create_env)
        buttons_grid.add_widget(btn1)
        
        btn2 = Button(text='Start Backend', background_color=(0.3, 0.7, 0.3, 1), font_size='13sp')
        btn2.bind(on_press=self.start_backend_btn)
        buttons_grid.add_widget(btn2)
        
        btn3 = Button(text='Start Frontend', background_color=(0.8, 0.5, 0.2, 1), font_size='13sp')
        btn3.bind(on_press=self.start_frontend_btn)
        buttons_grid.add_widget(btn3)
        
        btn4 = Button(text='Start Both Servers', background_color=(0.6, 0.2, 0.6, 1), font_size='13sp')
        btn4.bind(on_press=self.start_both_btn)
        buttons_grid.add_widget(btn4)
        
        control_layout.add_widget(buttons_grid)
        main_layout.add_widget(control_layout)
        
        # Divider
        divider3 = Label(size_hint_y=None, height=2)
        with divider3.canvas.before:
            Color(0.8, 0.8, 0.8, 1)
            Rectangle(pos=divider3.pos, size=divider3.size)
        main_layout.add_widget(divider3)
        
        # Output section
        output_label = Label(text='Output Log', size_hint_y=None, height=30, font_size='16sp', bold=True)
        main_layout.add_widget(output_label)
        
        scroll_view = ScrollView(size_hint=(1, 1))
        self.output_widget = TextInput(
            multiline=True,
            readonly=True,
            size_hint_y=None,
            height=400,
            font_size='12sp'
        )
        scroll_view.add_widget(self.output_widget)
        main_layout.add_widget(scroll_view)
        
        return main_layout
    
    def show_instructions(self, instance):
        """Show instructions popup."""
        instructions_text = """JobPrep Setup Guide

1. API Key (Optional)
   - Get your free API key from https://ai.google.dev/
   - Paste it in the API Key field above
   - You can skip this and configure it later

2. Create .env Files
   - Click "Create .env Files" to initialize configuration
   - This creates backend/.env and frontend/.env
   - Stores API key and server URLs

3. Start Servers
   - Backend: Runs on http://localhost:8000
   - Frontend: Runs on http://localhost:5173
   - Click "Start Both Servers" to run both simultaneously
   - Output appears in the log below

4. Access the Application
   - Open http://localhost:5173 in your browser
   - Backend API available at http://localhost:8000
   - Check the output log for any errors

Tips:
   - You can leave API key blank and add it to backend/.env later
   - Servers keep running in the background
   - Close this window to stop servers
"""
        
        popup_layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        scroll = ScrollView()
        instructions_label = Label(
            text=instructions_text,
            size_hint_y=None,
            markup=False,
            font_size='14sp'
        )
        instructions_label.bind(texture_size=instructions_label.setter('size'))
        scroll.add_widget(instructions_label)
        popup_layout.add_widget(scroll)
        
        close_btn = Button(text='Close', size_hint_y=None, height=50)
        popup_layout.add_widget(close_btn)
        
        popup = Popup(title='JobPrep Setup Instructions', content=popup_layout, size_hint=(0.8, 0.8))
        close_btn.bind(on_press=popup.dismiss)
        popup.open()
    
    def log(self, text):
        """Append text to output widget."""
        if self.output_widget:
            self.output_widget.text += text + '\n'
            # Scroll to bottom
            self.output_widget.cursor = (0, len(self.output_widget.text))
    
    def create_env(self, instance):
        """Create .env files in backend and frontend directories."""
        self.api_key = self.api_entry.text.strip()
        
        if not self.api_key:
            self.log('WARNING: No API key set. .env files will be created without API key.')
        
        try:
            be_path = BACKEND_DIR / '.env'
            if be_path.exists():
                be_path.rename(BACKEND_DIR / '.env.backup')
                self.log('✓ Backed up existing backend/.env')
            
            content = [
                '# Google Gemini API Key',
                f'GOOGLE_API_KEY={self.api_key}',
                '',
                '# Database configuration',
                'DATABASE_URL=sqlite:///./jobprep.db',
                '',
                '# Frontend URL for CORS',
                'FRONTEND_URL=http://localhost:5173',
            ]
            be_path.write_text('\n'.join(content))
            self.log(f'✓ Created backend/.env')
            
            fe_path = FRONTEND_DIR / '.env'
            if fe_path.exists():
                fe_path.rename(FRONTEND_DIR / '.env.backup')
                self.log('✓ Backed up existing frontend/.env')
            
            fe_path.write_text('VITE_API_URL=http://localhost:8000\n')
            self.log(f'✓ Created frontend/.env')
            self.log('')
        except Exception as e:
            self.log(f'ERROR: Failed to create .env files: {e}')
    
    def _read_stream(self, stream, name):
        """Read subprocess output and display it in a thread."""
        try:
            for line in iter(stream.readline, b''):
                if line:
                    text = line.decode(errors='ignore').rstrip()
                    if text:
                        self.log(f'[{name}] {text}')
        except Exception:
            pass
    
    def start_backend_btn(self, instance):
        """Start backend button handler."""
        self.start_backend()
    
    def start_frontend_btn(self, instance):
        """Start frontend button handler."""
        self.start_frontend()
    
    def start_both_btn(self, instance):
        """Start both servers."""
        self.create_env(None)
        self.start_backend()
        self.start_frontend()
    
    def start_backend(self):
        """Start the backend server."""
        if self.backend_proc and self.backend_proc.poll() is None:
            self.log('Backend is already running.')
            return
        
        if not (BACKEND_DIR / 'main.py').exists():
            self.log('ERROR: backend/main.py not found')
            return
        
        # Prefer embedded Python in the repo (if present), otherwise fall back to sys.executable
        embedded_py = REPO_ROOT / 'python' / 'python.exe'
        if embedded_py.exists():
            python_exe = str(embedded_py)
        else:
            python_exe = sys.executable
        self.log(f'Starting backend with {python_exe}...')
        try:
            env = os.environ.copy()
            use_shell = os.name == 'nt'
            # Run from repo root with backend.main:app as the module path
            self.backend_proc = subprocess.Popen(
                [python_exe, '-m', 'uvicorn', 'backend.main:app', '--reload', '--reload-dir', 'backend', '--host', '0.0.0.0', '--port', '8000'],
                cwd=str(REPO_ROOT),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                shell=use_shell,
                env=env
            )
            threading.Thread(target=self._read_stream, args=(self.backend_proc.stdout, 'backend'), daemon=True).start()
            self.log('✓ Backend started on http://localhost:8000')
        except Exception as e:
            self.log(f'ERROR: Failed to start backend: {e}')
    
    def start_frontend(self):
        """Start the frontend server."""
        if self.frontend_proc and self.frontend_proc.poll() is None:
            self.log('Frontend is already running.')
            return
        
        if not (FRONTEND_DIR / 'package.json').exists():
            self.log('ERROR: frontend/package.json not found')
            return
        
        self.log(f'Starting frontend with npm run dev...')
        try:
            use_shell = os.name == 'nt'
            self.frontend_proc = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=str(FRONTEND_DIR),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                shell=use_shell
            )
            threading.Thread(target=self._read_stream, args=(self.frontend_proc.stdout, 'frontend'), daemon=True).start()
            self.log('✓ Frontend started')
        except Exception as e:
            self.log(f'ERROR: Failed to start frontend: {e}')
    
    def on_stop(self):
        """Clean up on app exit."""
        self.log('\n[INFO] Cleaning up and shutting down...')
        
        # Terminate backend process
        if self.backend_proc and self.backend_proc.poll() is None:
            try:
                self.log('[INFO] Stopping backend...')
                self.backend_proc.terminate()
                self.backend_proc.wait(timeout=3)  # Wait up to 3 seconds
                self.log('[OK] Backend stopped')
            except subprocess.TimeoutExpired:
                try:
                    self.log('[WARNING] Backend not responding, force killing...')
                    self.backend_proc.kill()
                    self.backend_proc.wait()
                    self.log('[OK] Backend force killed')
                except Exception as e:
                    self.log(f'[ERROR] Failed to kill backend: {e}')
            except Exception as e:
                self.log(f'[ERROR] Failed to stop backend: {e}')
        
        # Terminate frontend process
        if self.frontend_proc and self.frontend_proc.poll() is None:
            try:
                self.log('[INFO] Stopping frontend...')
                self.frontend_proc.terminate()
                self.frontend_proc.wait(timeout=3)  # Wait up to 3 seconds
                self.log('[OK] Frontend stopped')
            except subprocess.TimeoutExpired:
                try:
                    self.log('[WARNING] Frontend not responding, force killing...')
                    self.frontend_proc.kill()
                    self.frontend_proc.wait()
                    self.log('[OK] Frontend force killed')
                except Exception as e:
                    self.log(f'[ERROR] Failed to kill frontend: {e}')
            except Exception as e:
                self.log(f'[ERROR] Failed to stop frontend: {e}')
        
        self.log('[OK] Cleanup complete. Goodbye!')
        time.sleep(0.5)  # Give time for threads to finish
        return True


def try_kivy_ui():
    """Try to launch Kivy GUI, return True if successful."""
    try:
        app = JobPrepSetupApp()
        app.title = 'JobPrep Setup'
        app.run()
        return True
    except Exception as e:
        print(f'Kivy UI failed: {e}')
        return False


class ConsoleUI:
    """Console-based UI for setup (fallback when Kivy is unavailable)."""
    
    def __init__(self):
        self.api_key = ''
        self.backend_proc = None
        self.frontend_proc = None
        self.active_threads = []  # Track active daemon threads
    
    def log(self, text):
        print(text)
    
    def create_env(self):
        """Create .env files in backend and frontend directories."""
        if not self.api_key:
            print('\nWARNING: No API key set. .env files will be created without API key.')
        
        try:
            be_path = BACKEND_DIR / '.env'
            if be_path.exists():
                be_path.rename(BACKEND_DIR / '.env.backup')
                self.log('[OK] Backed up existing backend/.env')
            
            content = [
                '# Google Gemini API Key',
                f'GOOGLE_API_KEY={self.api_key}',
                '',
                '# Database configuration',
                'DATABASE_URL=sqlite:///./jobprep.db',
                '',
                '# Frontend URL for CORS',
                'FRONTEND_URL=http://localhost:5173',
            ]
            be_path.write_text('\n'.join(content))
            self.log(f'[OK] Created backend/.env')
            
            fe_path = FRONTEND_DIR / '.env'
            if fe_path.exists():
                fe_path.rename(FRONTEND_DIR / '.env.backup')
                self.log('[OK] Backed up existing frontend/.env')
            
            fe_path.write_text('VITE_API_URL=http://localhost:8000\n')
            self.log(f'[OK] Created frontend/.env')
            self.log('')
        except Exception as e:
            self.log(f'\nERROR: Failed to create .env files: {e}')
    
    def _read_stream(self, stream, name):
        """Read subprocess output and display it."""
        try:
            for line in iter(stream.readline, b''):
                if line:
                    text = line.decode(errors='ignore').rstrip()
                    if text:
                        print(f'[{name}] {text}')
        except Exception:
            pass
        finally:
            try:
                stream.close()
            except Exception:
                pass
    
    def start_backend(self):
        """Start the backend server."""
        if self.backend_proc and self.backend_proc.poll() is None:
            self.log('Backend is already running.')
            return
        
        if not (BACKEND_DIR / 'main.py').exists():
            self.log('ERROR: backend/main.py not found')
            return
        
        # Prefer embedded Python in the repo (if present), otherwise fall back to sys.executable
        embedded_py = REPO_ROOT / 'python' / 'python.exe'
        if embedded_py.exists():
            python_exe = str(embedded_py)
        else:
            python_exe = sys.executable
        self.log(f'Starting backend with {python_exe}...')
        try:
            env = os.environ.copy()
            use_shell = os.name == 'nt'
            # Run from repo root with backend.main:app as the module path
            self.backend_proc = subprocess.Popen(
                [python_exe, '-m', 'uvicorn', 'backend.main:app', '--reload', '--reload-dir', 'backend', '--host', '0.0.0.0', '--port', '8000'],
                cwd=str(REPO_ROOT),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                shell=use_shell,
                env=env
            )
            backend_thread = threading.Thread(target=self._read_stream, args=(self.backend_proc.stdout, 'backend'), daemon=True)
            backend_thread.start()
            self.active_threads.append(backend_thread)
            self.log('[OK] Backend started on http://localhost:8000 (output above)')
        except Exception as e:
            self.log(f'[ERROR] Failed to start backend: {e}')
    
    def start_frontend(self):
        """Start the frontend server."""
        if self.frontend_proc and self.frontend_proc.poll() is None:
            self.log('Frontend is already running.')
            return
        
        if not (FRONTEND_DIR / 'package.json').exists():
            self.log('ERROR: frontend/package.json not found')
            return
        
        self.log(f'Starting frontend...')
        try:
            use_shell = os.name == 'nt'
            self.frontend_proc = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=str(FRONTEND_DIR),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                shell=use_shell
            )
            frontend_thread = threading.Thread(target=self._read_stream, args=(self.frontend_proc.stdout, 'frontend'), daemon=True)
            frontend_thread.start()
            self.active_threads.append(frontend_thread)
            self.log('[OK] Frontend started (output above)')
        except Exception as e:
            self.log(f'[ERROR] Failed to start frontend: {e}')
    
    def start_both(self):
        """Create .env files and start both servers."""
        self.create_env()
        time.sleep(0.5)
        self.start_backend()
        time.sleep(2)
        self.start_frontend()
    
    def run(self):
        """Main menu loop."""
        while True:
            print('\n' + '='*60)
            print('           JobPrep Setup - Interactive Menu')
            print('='*60)
            print()
            print(f'API Key: {"[OK] Set" if self.api_key else "[NO] Not set"}')
            print()
            print('1. Enter/Paste Google AI API Key')
            print('2. Create .env files')
            print('3. Start Backend Server')
            print('4. Start Frontend Server')
            print('5. Start Backend + Frontend')
            print('0. Exit')
            print()
            
            choice = input('Select an option (0-5): ').strip()
            
            if choice == '1':
                print()
                print('Get your free API key from: https://ai.google.dev/')
                print()
                key = input('Paste your Google AI Studio API key (or press Enter to skip): ').strip()
                if key:
                    self.api_key = key
                    print('[OK] API key set')
                else:
                    self.api_key = ''
                    print('[SKIP] API key skipped')
            
            elif choice == '2':
                print()
                self.create_env()
            
            elif choice == '3':
                print()
                self.start_backend()
                print('\nBackend is starting. Press Ctrl+C to stop, or continue in menu.')
                time.sleep(1)
            
            elif choice == '4':
                print()
                self.start_frontend()
                print('\nFrontend is starting. Press Ctrl+C to stop, or continue in menu.')
                time.sleep(1)
            
            elif choice == '5':
                print()
                self.start_both()
                print('\nBoth servers are starting.')
                print('Backend:  http://localhost:8000')
                print('Frontend: http://localhost:5173')
                print('\nPress Ctrl+C to stop, or continue in menu.')
                time.sleep(1)
            
            elif choice == '0':
                print()
                stop = input('Stop running servers before exit? (y/n): ').strip().lower()
                if stop == 'y':
                    # Terminate backend process
                    if self.backend_proc and self.backend_proc.poll() is None:
                        try:
                            print('[INFO] Stopping backend...')
                            self.backend_proc.terminate()
                            self.backend_proc.wait(timeout=3)
                            print('[OK] Backend stopped')
                        except subprocess.TimeoutExpired:
                            try:
                                print('[WARNING] Backend not responding, force killing...')
                                self.backend_proc.kill()
                                self.backend_proc.wait()
                                print('[OK] Backend force killed')
                            except Exception as e:
                                print(f'[ERROR] Failed to kill backend: {e}')
                        except Exception as e:
                            print(f'[ERROR] Failed to stop backend: {e}')
                    
                    # Terminate frontend process
                    if self.frontend_proc and self.frontend_proc.poll() is None:
                        try:
                            print('[INFO] Stopping frontend...')
                            self.frontend_proc.terminate()
                            self.frontend_proc.wait(timeout=3)
                            print('[OK] Frontend stopped')
                        except subprocess.TimeoutExpired:
                            try:
                                print('[WARNING] Frontend not responding, force killing...')
                                self.frontend_proc.kill()
                                self.frontend_proc.wait()
                                print('[OK] Frontend force killed')
                            except Exception as e:
                                print(f'[ERROR] Failed to kill frontend: {e}')
                        except Exception as e:
                            print(f'[ERROR] Failed to stop frontend: {e}')
                    
                    # Wait for daemon threads to finish
                    time.sleep(0.5)
                
                print('[OK] Exiting.')
                break
            
            else:
                print('\nInvalid choice. Please try again.')


def main():
    """Main entry point: try Kivy, fall back to console UI."""
    if try_kivy_ui():
        return
    
    # Fallback to console UI
    print('\nKivy not available. Using console UI instead.\n')
    ui = ConsoleUI()
    try:
        ui.run()
    except KeyboardInterrupt:
        print('\n\n[INFO] Interrupted by user. Cleaning up...')
        
        # Terminate backend process
        if ui.backend_proc and ui.backend_proc.poll() is None:
            try:
                print('[INFO] Stopping backend...')
                ui.backend_proc.terminate()
                ui.backend_proc.wait(timeout=3)
                print('[OK] Backend stopped')
            except subprocess.TimeoutExpired:
                try:
                    print('[WARNING] Backend not responding, force killing...')
                    ui.backend_proc.kill()
                    ui.backend_proc.wait()
                    print('[OK] Backend force killed')
                except Exception as e:
                    print(f'[ERROR] Failed to kill backend: {e}')
            except Exception as e:
                print(f'[ERROR] Failed to stop backend: {e}')
        
        # Terminate frontend process
        if ui.frontend_proc and ui.frontend_proc.poll() is None:
            try:
                print('[INFO] Stopping frontend...')
                ui.frontend_proc.terminate()
                ui.frontend_proc.wait(timeout=3)
                print('[OK] Frontend stopped')
            except subprocess.TimeoutExpired:
                try:
                    print('[WARNING] Frontend not responding, force killing...')
                    ui.frontend_proc.kill()
                    ui.frontend_proc.wait()
                    print('[OK] Frontend force killed')
                except Exception as e:
                    print(f'[ERROR] Failed to kill frontend: {e}')
            except Exception as e:
                print(f'[ERROR] Failed to stop frontend: {e}')
        
        print('[OK] Cleanup complete. Goodbye!')
        time.sleep(0.5)  # Give time for daemon threads to finish
        sys.exit(0)


if __name__ == '__main__':
    main()
