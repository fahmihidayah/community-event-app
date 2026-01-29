import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Zap, Palette, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen mx-auto container">
      <section className="mx-auto max-w-4xl text-center py-24">
        <div className="flex justify-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground">
            <Rocket className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Payload Starter
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          A modern web application built with Payload CMS, Next.js, and cutting-edge technologies.
          Get started by creating an account or exploring our features.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Powerful CMS with Payload</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your content with ease using Payload CMS's intuitive interface and powerful
                features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 mb-4">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>Built with Next.js 15 and React 19</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Leverage the latest web technologies for optimal performance and developer
                experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 mb-4">
                <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Beautiful UI</CardTitle>
              <CardDescription>Styled with shadcn/ui components</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Clean, accessible, and customizable components built on top of Radix UI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
